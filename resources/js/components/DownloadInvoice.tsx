import { route } from 'ziggy-js';

export default function DownloadInvoice({ patientId }: { patientId: number }) {

  async function handleDownload() {
    try {
      const response = await fetch(route('patients.download-invoice', { patient: patientId }), {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `invoice-patient-${patientId}.pdf`;

      if (disposition && disposition.includes('filename=')) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="bg-gray-600 rounded-md text-white px-4 py-2 hover:bg-gray-800"
    >
      تحميل الفاتورة
    </button>
  );
}
