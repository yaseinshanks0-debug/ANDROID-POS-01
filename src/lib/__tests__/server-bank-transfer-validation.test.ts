import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateBankTransferTransaction,
  validateServerTransactionsBatch,
} from '../pos-calculations.ts';

test('Server-side & shared bank transfer reference validation (Problem #4)', async (t) => {
  await t.test('rejects paid or partial bank_transfer transaction missing transferReference', () => {
    const missingRefPaid = validateBankTransferTransaction({
      id: 'TXN-BT-001',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      grandTotal: 15000,
    });
    assert.equal(missingRefPaid.valid, false);
    assert.equal(missingRefPaid.errorCode, 'BANK_TRANSFER_REFERENCE_REQUIRED');

    const whitespaceRefPartial = validateBankTransferTransaction({
      id: 'TXN-BT-002',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'partial',
      transferReference: '    ',
      grandTotal: 15000,
      amountPaid: 5000,
    });
    assert.equal(whitespaceRefPartial.valid, false);
    assert.equal(whitespaceRefPartial.errorCode, 'BANK_TRANSFER_REFERENCE_REQUIRED');
  });

  await t.test('accepts paid or partial bank_transfer transaction with valid transferReference', () => {
    const validPaid = validateBankTransferTransaction({
      id: 'TXN-BT-003',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      transferReference: 'BNK-2026-99102',
      grandTotal: 15000,
    });
    assert.equal(validPaid.valid, true);

    const validPartial = validateBankTransferTransaction({
      id: 'TXN-BT-004',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'partial',
      transferReference: 'MBOK-774120',
      grandTotal: 15000,
      amountPaid: 7500,
    });
    assert.equal(validPartial.valid, true);
  });

  await t.test('allows unpaid (full debt) or cancelled bank_transfer without transferReference', () => {
    const unpaidTx = validateBankTransferTransaction({
      id: 'TXN-BT-005',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'unpaid',
      grandTotal: 15000,
      amountPaid: 0,
      debtAmount: 15000,
    });
    assert.equal(unpaidTx.valid, true);

    const cancelledTx = validateBankTransferTransaction({
      id: 'TXN-BT-006',
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      status: 'cancelled',
      grandTotal: 15000,
    });
    assert.equal(cancelledTx.valid, true);
  });

  await t.test('validates bank_transfer inside debtPayments settlement history', () => {
    const missingDebtRef = validateBankTransferTransaction({
      id: 'TXN-DEBT-001',
      paymentMethod: 'cash',
      paymentStatus: 'partial',
      debtPayments: [
        {
          id: 'dp-1',
          amountPaid: 5000,
          paymentMethod: 'bank_transfer',
          transferReference: '',
        },
      ],
    });
    assert.equal(missingDebtRef.valid, false);
    assert.equal(missingDebtRef.errorCode, 'BANK_TRANSFER_REFERENCE_REQUIRED');

    const validDebtRef = validateBankTransferTransaction({
      id: 'TXN-DEBT-002',
      paymentMethod: 'cash',
      paymentStatus: 'partial',
      debtPayments: [
        {
          id: 'dp-2',
          amountPaid: 5000,
          paymentMethod: 'bank_transfer',
          transferReference: 'BNK-SETTLE-402',
        },
      ],
    });
    assert.equal(validDebtRef.valid, true);
  });

  await t.test('validateServerTransactionsBatch rejects batch containing invalid bank_transfer and identifies transaction ID', () => {
    const batchResult = validateServerTransactionsBatch([
      {
        id: 'TXN-OK-1',
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        grandTotal: 1000,
      },
      {
        id: 'TXN-BAD-BT-2',
        paymentMethod: 'bank_transfer',
        paymentStatus: 'paid',
        transferReference: '',
        grandTotal: 8500,
      },
    ]);

    assert.equal(batchResult.valid, false);
    assert.equal(batchResult.errorCode, 'BANK_TRANSFER_REFERENCE_REQUIRED');
    assert.equal(batchResult.invalidTransactionId, 'TXN-BAD-BT-2');
  });
});
