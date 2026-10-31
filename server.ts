/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { hasDatabaseCredentials } from './src/db/index.ts';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './src/db/products-repo.ts';
import {
  getAllCurrencies,
  getBaseCurrency,
  createOrUpdateCurrency,
  deleteCurrency,
  getAllExchangeRates,
  getEffectiveExchangeRates,
  getExchangeRateHistory,
  setExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
  convertAmount,
} from './src/db/currencies-repo.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Authorization guard for settings modifications
const requireAdminOrManager = (req: Request, res: Response, next: express.NextFunction) => {
  const role = (req.headers['x-user-role'] as string | undefined)?.toLowerCase();
  if (role && role === 'cashier') {
    return res.status(403).json({
      error: 'Insufficient permissions: Cashiers are not authorized to modify exchange rates.',
    });
  }
  next();
};

// API: Health & Database Connectivity status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    postgresConfigured: hasDatabaseCredentials(),
    databaseType: hasDatabaseCredentials() ? 'PostgreSQL (Connected)' : 'Durable Local Store (Active)',
  });
});

// API: Currencies Endpoints
app.get('/api/currencies', async (req: Request, res: Response) => {
  try {
    const list = await getAllCurrencies();
    const base = await getBaseCurrency();
    res.json({
      baseCurrency: base.code,
      currencies: list,
    });
  } catch (error: any) {
    console.error('Failed to fetch currencies:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch currencies' });
  }
});

app.post('/api/currencies', requireAdminOrManager, async (req: Request, res: Response) => {
  try {
    const { code, name, nameAr, symbol, decimalPlaces, initialRateToBase, createdBy } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Currency code is required.' });
    }
    const created = await createOrUpdateCurrency({
      code,
      name: name || code,
      nameAr,
      symbol: symbol || code,
      decimalPlaces: decimalPlaces !== undefined ? Number(decimalPlaces) : 2,
      initialRateToBase: initialRateToBase !== undefined ? Number(initialRateToBase) : undefined,
      createdBy: createdBy || 'admin_user',
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create/update currency:', error);
    res.status(400).json({ error: error.message || 'Failed to save currency' });
  }
});

app.delete('/api/currencies/:code', requireAdminOrManager, async (req: Request, res: Response) => {
  try {
    const result = await deleteCurrency(req.params.code);
    res.json(result);
  } catch (error: any) {
    console.error(`Failed to delete currency ${req.params.code}:`, error);
    const status = error.message?.includes('not found') ? 404 : 400;
    res.status(status).json({ error: error.message || 'Failed to delete currency' });
  }
});

// API: Exchange Rates Endpoints
app.get('/api/exchange-rates', async (req: Request, res: Response) => {
  try {
    const effectiveOnly = req.query.effective === 'true';
    const source = req.query.source as string | undefined;
    const target = req.query.target as string | undefined;

    if (effectiveOnly) {
      const effectiveRates = await getEffectiveExchangeRates();
      return res.json(effectiveRates);
    }

    const rates = await getAllExchangeRates({ source, target });
    res.json(rates);
  } catch (error: any) {
    console.error('Failed to fetch exchange rates:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch exchange rates' });
  }
});

app.get('/api/exchange-rates/history', async (req: Request, res: Response) => {
  try {
    const source = (req.query.source as string) || 'USD';
    const target = (req.query.target as string) || 'SDG';
    const history = await getExchangeRateHistory(source, target);
    res.json(history);
  } catch (error: any) {
    console.error('Failed to fetch exchange rate history:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch exchange rate history' });
  }
});

app.post('/api/exchange-rates', requireAdminOrManager, async (req: Request, res: Response) => {
  try {
    const { sourceCurrency, targetCurrency, rate, effectiveFrom, expiryDate, createdBy } = req.body;

    if (!sourceCurrency || !targetCurrency) {
      return res.status(400).json({ error: 'sourceCurrency and targetCurrency are required.' });
    }

    if (rate === undefined || rate === null) {
      return res.status(400).json({ error: 'rate is required.' });
    }

    const saved = await setExchangeRate({
      sourceCurrency,
      targetCurrency,
      rate: Number(rate),
      effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      createdBy: createdBy || 'admin_user',
    });

    res.status(201).json(saved);
  } catch (error: any) {
    console.error('Failed to create exchange rate:', error);
    const msg = error.message || '';
    if (msg.includes('not a recognized') || msg.includes('not found')) {
      return res.status(404).json({ error: msg });
    }
    if (
      msg.includes('positive number') ||
      msg.includes('cannot be identical') ||
      msg.includes('Expiry date must be later') ||
      msg.includes('Invalid')
    ) {
      return res.status(400).json({ error: msg });
    }
    res.status(500).json({ error: msg || 'Failed to save exchange rate' });
  }
});

app.put('/api/exchange-rates/:id', requireAdminOrManager, async (req: Request, res: Response) => {
  try {
    const updated = await updateExchangeRate(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error(`Failed to update exchange rate ${req.params.id}:`, error);
    const msg = error.message || '';
    if (msg.includes('not found')) {
      return res.status(404).json({ error: msg });
    }
    if (msg.includes('positive number')) {
      return res.status(400).json({ error: msg });
    }
    res.status(500).json({ error: msg || 'Failed to update exchange rate' });
  }
});

app.delete('/api/exchange-rates/:id', requireAdminOrManager, async (req: Request, res: Response) => {
  try {
    const result = await deleteExchangeRate(req.params.id);
    res.json(result);
  } catch (error: any) {
    console.error(`Failed to delete exchange rate ${req.params.id}:`, error);
    const status = error.message?.includes('not found') ? 404 : 400;
    res.status(status).json({ error: error.message || 'Failed to delete exchange rate' });
  }
});

app.get('/api/convert', async (req: Request, res: Response) => {
  try {
    const amount = parseFloat(req.query.amount as string);
    const from = req.query.from as string;
    const to = req.query.to as string;
    const timestamp = req.query.timestamp ? new Date(req.query.timestamp as string) : new Date();

    if (isNaN(amount) || !from || !to) {
      return res.status(400).json({ error: 'amount, from, and to are required query parameters.' });
    }

    const result = await convertAmount(amount, from, to, timestamp);
    res.json(result);
  } catch (error: any) {
    console.error('Failed to convert amount:', error);
    res.status(400).json({ error: error.message || 'Conversion failed' });
  }
});

// API: Products Endpoints
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string | undefined;
    const category = req.query.category as string | undefined;
    const items = await getAllProducts(query, category);
    res.json(items);
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const item = await getProductById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(item);
  } catch (error: any) {
    console.error(`Failed to fetch product ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to fetch product' });
  }
});

app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const {
      name,
      nameAr,
      sku,
      barcode,
      barcodes,
      category,
      categoryAr,
      costPrice,
      sellingPrice,
      priceCurrency,
      stock,
      minStockAlert,
      image,
      imageUrl,
      emoji,
      colorHex,
      customFields,
    } = req.body;

    if (!name || !sku || !barcode) {
      return res.status(400).json({ error: 'Name, SKU, and barcode are required.' });
    }

    const created = await createProduct({
      name,
      nameAr,
      sku,
      barcode,
      barcodes: Array.isArray(barcodes) ? barcodes : undefined,
      category: category || 'General',
      categoryAr,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      priceCurrency: priceCurrency || 'SDG',
      stock: Number(stock) || 0,
      minStockAlert: Number(minStockAlert) || 5,
      image: image || imageUrl || undefined,
      imageUrl: image || imageUrl || null,
      emoji: emoji || '📦',
      colorHex: colorHex || '#d97706',
      customFields: customFields || {},
    });

    res.status(201).json(created);
  } catch (error: any) {
    console.error('Failed to create product:', error);
    const statusCode = error.message?.includes('Duplicate') ? 409 : 400;
    res.status(statusCode).json({ error: error.message || 'Failed to create product' });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error(`Failed to update product ${req.params.id}:`, error);
    const statusCode = error.message?.includes('Duplicate')
      ? 409
      : error.message?.includes('not found')
      ? 404
      : 400;
    res.status(statusCode).json({ error: error.message || 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ success: true, message: `Product ${req.params.id} deleted.` });
  } catch (error: any) {
    console.error(`Failed to delete product ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Failed to delete product' });
  }
});

// Full-stack Vite development integration
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production static file hosting
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dqnamo POS Backend Server listening on http://0.0.0.0:${PORT}`);
});
