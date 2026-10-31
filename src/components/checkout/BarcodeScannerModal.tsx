/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { AppModal } from '../ui/AppModal';
import { TactileButton } from '../ui/TactileButton';
import { AppInput } from '../ui/AppInput';
import { Camera, Barcode, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';
import { playScannerBeep, triggerHaptic } from '../../lib/sound-fx';
import { getAllProductBarcodes, matchesProductBarcode } from '../../lib/inventory-rules';

export interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (barcode: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScan,
}) => {
  const { products, settings } = usePOS();
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastScannedItem, setLastScannedItem] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Attempt real camera stream if available, otherwise show clean tactile viewport
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isOpen) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
              videoRef.current.play().catch(() => {});
            }
            setCameraActive(true);
            setCameraError(null);
          })
          .catch(() => {
            setCameraError('Camera access unavailable in sandbox or declined.');
            setCameraActive(false);
          });
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleBarcodeHit = (code: string) => {
    const matchedProduct = products.find(
      (p) => matchesProductBarcode(p, code, true) || p.sku.toLowerCase() === code.toLowerCase()
    );
    playScannerBeep(settings.soundEnabled);
    triggerHaptic('success', settings.hapticsEnabled);

    if (matchedProduct) {
      setLastScannedItem(matchedProduct.name);
      onScan(code);
      setTimeout(() => {
        onClose();
      }, 350);
    } else {
      setLastScannedItem(`Unknown Barcode: ${code}`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleBarcodeHit(manualCode.trim());
    setManualCode('');
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Barcode & SKU Scanner"
      description="Scan product barcode with camera or tap any barcode below"
    >
      <div className="flex flex-col gap-5">
        {/* Viewport / Laser Beam */}
        <div className="relative w-full h-48 bg-neutral-950 rounded-2xl border-2 border-dashed border-amber-500/50 overflow-hidden flex flex-col items-center justify-center">
          {cameraActive ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-neutral-500 z-10 px-4 text-center">
              <Camera className="w-8 h-8 text-amber-500/80 animate-pulse" />
              <span className="text-xs font-mono">
                {cameraError || 'Target barcode in viewfinder'}
              </span>
            </div>
          )}

          {/* Animated red laser scanning line */}
          <div className="absolute inset-x-6 h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-bounce z-20" />

          {/* Crosshairs */}
          <div className="absolute inset-6 border border-amber-500/30 rounded-xl pointer-events-none" />
        </div>

        {lastScannedItem && (
          <div className="flex items-center gap-2 p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Scanned: {lastScannedItem}</span>
          </div>
        )}

        {/* Manual Barcode Input */}
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <AppInput
            placeholder="Type barcode or SKU..."
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            leftIcon={<Barcode className="w-4 h-4" />}
            autoFocus
          />
          <TactileButton variant="primary" type="submit" size="md">
            Scan
          </TactileButton>
        </form>

        {/* Quick Simulation Barcode Chips */}
        <div>
          <span className="text-xs font-semibold text-neutral-400 block mb-2">
            Simulate Scan (Tap any store product barcode):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
            {products.map((p) => {
              const allCodes = getAllProductBarcodes(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleBarcodeHit(allCodes[0] || p.barcode)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 text-left transition-colors cursor-pointer group"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-medium text-white truncate">{p.name}</div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {allCodes.join(' • ')}
                    </div>
                  </div>
                  <Barcode className="w-4 h-4 text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppModal>
  );
};
