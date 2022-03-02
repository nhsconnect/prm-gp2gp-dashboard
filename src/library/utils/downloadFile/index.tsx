export function downloadFile(data: string, fileName: string, fileType: string) {
  const blob = new Blob([data], { type: fileType });

  const link = document.createElement("a");
  link.download = fileName;
  link.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  link.dispatchEvent(clickEvt);
  link.remove();
}
