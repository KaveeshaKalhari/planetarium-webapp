import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle2, XCircle, ScanLine, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { AdminSidebar } from '../components/AdminSidebar';

type LookupResult = {
    bookingReference: string;
    customerName: string;
    showDate: string;
    showTime: string;
    numberOfSeats: number;
    seatIds: string[];
    status: string;
    paymentStatus: string;
    checkedIn: boolean;
    checkedInAt: string | null;
};

const READER_ELEMENT_ID = 'ticket-qr-reader';

export function TicketScanPage() {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scanning, setScanning] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const [result, setResult] = useState<LookupResult | null>(null);
    const [lookupError, setLookupError] = useState<string | null>(null);
    const [confirming, setConfirming] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

    const startScanner = async () => {
        setCameraError(null);
        setResult(null);
        setLookupError(null);
        setConfirmMessage(null);

        const scanner = new Html5Qrcode(READER_ELEMENT_ID);
        scannerRef.current = scanner;

        try {
            await scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => {
                    handleScanSuccess(decodedText);
                },
                () => {
                    // fired continuously while no QR is in view — ignore
                }
            );
            setScanning(true);
        } catch (err: any) {
            setCameraError(
                'Could not access the camera. Check camera permissions for this site.'
            );
            console.error(err);
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.stop();
                await scannerRef.current.clear();
            } catch {
                // scanner was already stopped — ignore
            }
        }
        setScanning(false);
    };

    const handleScanSuccess = async (bookingReference: string) => {
        // Pause scanning while we look this ticket up
        await stopScanner();
        setLookupError(null);
        setResult(null);

        try {
            const res = await api.get(`/bookings/admin/lookup/${bookingReference}`);
            setResult(res.data);
        } catch (err: any) {
            setLookupError(
                err?.response?.data?.message || 'Ticket not found for this QR code.'
            );
        }
    };

    const handleConfirmEntry = async () => {
        if (!result) return;
        setConfirming(true);
        setConfirmMessage(null);
        try {
            const res = await api.post(`/bookings/admin/checkin/${result.bookingReference}`);
            setResult(res.data);
            setConfirmMessage('Entry confirmed — welcome them in!');
        } catch (err: any) {
            setConfirmMessage(
                err?.response?.data?.message || 'Could not confirm entry.'
            );
        } finally {
            setConfirming(false);
        }
    };

    useEffect(() => {
        return () => {
            // stop camera when leaving the page
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    const isValidTicket =
        result &&
        result.status !== 'CANCELLED' &&
        result.paymentStatus === 'SUCCESS' &&
        !result.checkedIn;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <div className="flex-1 p-8 max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-bold text-[#001F54] mb-1">Ticket Scanner</h1>
                <p className="text-gray-500 mb-6">
                    Scan a visitor's ticket QR code to confirm entry.
                </p>

                {/* Camera / scanner box */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    {!scanning && !result && !lookupError && (
                        <div className="flex flex-col items-center py-10">
                            <ScanLine className="w-12 h-12 text-[#1282A2] mb-3" />
                            <button
                                onClick={startScanner}
                                className="px-6 py-3 rounded-lg bg-[#1282A2] text-white font-medium hover:bg-[#0e6884] transition-colors"
                            >
                                Start Scanning
                            </button>
                            {cameraError && (
                                <p className="text-red-600 text-sm mt-3">{cameraError}</p>
                            )}
                        </div>
                    )}

                    <div
                        id={READER_ELEMENT_ID}
                        className={scanning ? 'w-full rounded-lg overflow-hidden' : 'hidden'}
                    />

                    {scanning && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={stopScanner}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Lookup error (invalid QR / not found) */}
                {lookupError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3 mb-6">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-red-700">Invalid ticket</p>
                            <p className="text-red-600 text-sm">{lookupError}</p>
                        </div>
                    </div>
                )}

                {/* Result card */}
                {result && (
                    <div
                        className={`rounded-xl p-6 border mb-6 ${
                            isValidTicket
                                ? 'bg-green-50 border-green-200'
                                : 'bg-yellow-50 border-yellow-200'
                        }`}
                    >
                        <div className="flex items-start gap-3 mb-4">
                            {isValidTicket ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                                <XCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className="font-semibold text-lg text-[#001F54]">
                                    {result.customerName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Ref: {result.bookingReference}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                            <div>
                                <span className="text-gray-500">Show date</span>
                                <p className="font-medium">{result.showDate}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Show time</span>
                                <p className="font-medium">{result.showTime}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Seats</span>
                                <p className="font-medium">
                                    {result.numberOfSeats} ({result.seatIds?.join(', ')})
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Payment</span>
                                <p className="font-medium">{result.paymentStatus}</p>
                            </div>
                        </div>

                        {result.checkedIn && (
                            <p className="text-yellow-700 text-sm font-medium mb-4">
                                Already checked in at {result.checkedInAt}
                            </p>
                        )}
                        {result.status === 'CANCELLED' && (
                            <p className="text-red-700 text-sm font-medium mb-4">
                                This booking was cancelled.
                            </p>
                        )}
                        {result.paymentStatus !== 'SUCCESS' && !result.checkedIn && (
                            <p className="text-red-700 text-sm font-medium mb-4">
                                Payment not confirmed for this booking.
                            </p>
                        )}

                        {confirmMessage && (
                            <p
                                className={`text-sm font-medium mb-3 ${
                                    result.checkedIn ? 'text-green-700' : 'text-red-700'
                                }`}
                            >
                                {confirmMessage}
                            </p>
                        )}

                        <div className="flex gap-3">
                            {isValidTicket && (
                                <button
                                    onClick={handleConfirmEntry}
                                    disabled={confirming}
                                    className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
                                >
                                    {confirming ? 'Confirming…' : 'Confirm Entry'}
                                </button>
                            )}
                            <button
                                onClick={startScanner}
                                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Scan Next
                            </button>
                        </div>
                    </div>
                )}

                {lookupError && (
                    <div className="flex">
                        <button
                            onClick={startScanner}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Scan Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}