// TODO: dynamically generate the PDF
import resume from "@pages/about/resume_wonhee_lee.pdf";

export function DownloadToPdf() {
  return (
    <a
      className="focus-outline flex whitespace-nowrap py-1 hover:opacity-75"
      href={resume}
      download="resume_wonhee_lee.pdf"
      target="_blank"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="h-6 w-6 scale-90 fill-transparent stroke-current stroke-2"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 11l5 5l5 -5" />
        <path d="M12 4l0 12" />
      </svg>
      <span>Download to PDF</span>
    </a>
  );
}
