import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toCanvas } from "html-to-image";
import jsPDF from "jspdf";
import { useLoading } from "../context/LoadingContext";
import { CustomButton } from "./CustomButton";
import { DownloadIcon } from "./icons/DownloadIcon";
import { useEffect } from "react";

interface DownloadButtonProps {
  id?: string;
}

const pagePadding = 20; // pt (jsPDF units)
const tocTitleHeight = 40; // Space for the "Table of Contents" title and some margin

const DownloadButton = ({ id }: DownloadButtonProps) => {
  const { setIsLoading } = useLoading();
  const { getNodes } = useReactFlow();

  const sendPdfToSalesforceAttachments = async (pdf: jsPDF) => {
    const pdfBase64 = pdf.output("datauristring");

    window.parent.postMessage(
      {
        type: "SAVE_PDF",
        payload: pdfBase64,
        fileName: "diagram.pdf",
        id,
      },
      "*"
    );
  };

  const handleClick = async () => {
    setIsLoading(true);

    setTimeout(() => {
      handleSavePdf();
    }, 100);
  };

  const handleSavePdf = async () => {
    const nodesBounds = getNodesBounds(getNodes());

    const viewElement = document.querySelector<HTMLElement>(
      ".react-flow__viewport"
    );
    if (!viewElement) {
      setIsLoading(false);
      return;
    }

    try {
      const pdf = new jsPDF("l", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // The available area for diagram content on a single content page
      const contentWidth = pageWidth - pagePadding * 2;
      const contentHeight = pageHeight - pagePadding * 2;

      const totalNodesWidth = nodesBounds.width;
      const totalNodesHeight = nodesBounds.height;
      const diagramX = nodesBounds.x;
      const diagramY = nodesBounds.y;

      // --------------------------------------------
      // 1. Calculate the Tiling Grid
      // --------------------------------------------
      const cols = Math.ceil(totalNodesWidth / contentWidth);
      const rows = Math.ceil(totalNodesHeight / contentHeight);

      const totalHeight = rows * contentHeight;
      const totalWidth = cols * contentWidth;

      // --------------------------------------------
      // 2. Generate Canvas for the WHOLE Diagram
      // --------------------------------------------
      const fullDiagramCanvas = await toCanvas(viewElement, {
        backgroundColor: "white",
        width: totalWidth,
        height: totalHeight,
        style: {
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
          transform: `translate(${-diagramX}px, ${-diagramY}px)`,
          transformOrigin: "top left",
        },
      });

      // --------------------------------------------
      // 4. Generate Content Pages (Page 2 onwards)
      // --------------------------------------------
      // Function to check if a canvas is entirely white/blank
      const isCanvasBlank = (canvas: HTMLCanvasElement): boolean => {
        const context = canvas.getContext("2d");
        if (!context) return true;

        // Get the pixel data from the canvas
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;

        // Check every pixel's color. Since we explicitly fill the background with white (255, 255, 255),
        // a blank page should only contain white pixels.
        // The image data is an array of [R, G, B, A] for every pixel.
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          // Check if the color is NOT white (255, 255, 255)
          // We use a small tolerance (e.g., < 250) in case of anti-aliasing or slight color shifts,
          // but for a clean fill and crop, checking for exact white (255) is often sufficient.
          if (r < 255 || g < 255 || b < 255) {
            return false; // Found a non-white pixel, so it's not blank
          }
        }
        return true; // All pixels are white
      };

      let pagesRendered = 0; // Track actual content pages rendered

      const renderedPagesNumbers = new Set<number>();

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offsetX = c * contentWidth;
          const offsetY = r * contentHeight;

          const tempCanvas = document.createElement("canvas");
          tempCanvas.width = contentWidth;
          tempCanvas.height = contentHeight;
          const ctx = tempCanvas.getContext("2d");

          if (ctx) {
            // FIX: Set the temporary canvas background to white
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, contentWidth, contentHeight);

            // Draw the relevant section of the full diagram canvas onto the temp canvas
            ctx.drawImage(
              fullDiagramCanvas,
              offsetX,
              offsetY,
              contentWidth,
              contentHeight,
              0,
              0,
              contentWidth,
              contentHeight
            );
          }

          // *** New Blank Page Check ***
          if (isCanvasBlank(tempCanvas)) {
            continue; // Skip the rest of the loop for this iteration
          }

          // Only add a new page if the content is NOT blank
          pdf.addPage();
          pagesRendered++; // Increment only when a page is added

          const contentImageData = tempCanvas.toDataURL("image/jpeg", 0.9);
          pdf.addImage(
            contentImageData,
            "JPEG",
            pagePadding,
            pagePadding,
            contentWidth,
            contentHeight
          );

          const currentPageNumber = pagesRendered + 1; // Content pages start after TOC (page 1)
          renderedPagesNumbers.add(r * cols + c + 2);
          pdf.setFontSize(8);
          pdf.text(
            `Page ${currentPageNumber}`,
            pageWidth - pagePadding,
            pageHeight - 10,
            { align: "right" }
          );
        }
      }

      // --------------------------------------------
      // 3. Generate Table of Contents (TOC) Page (Page 1)
      // --------------------------------------------
      pdf.setPage(1);
      pdf.setFontSize(16);
      pdf.text("Table of Contents", pagePadding, pagePadding + 10);

      // Available space for the scaled diagram on the TOC page
      const tocAvailableWidth = pageWidth - pagePadding * 2;
      const tocAvailableHeight = pageHeight - pagePadding * 2 - tocTitleHeight;

      // Calculate TOC scale based on the available space
      const tocScaleX = tocAvailableWidth / totalWidth;
      const tocScaleY = tocAvailableHeight / totalHeight;
      const tocScale = Math.min(tocScaleX, tocScaleY);

      const scaledDiagramWidth = totalWidth * tocScale;
      const scaledDiagramHeight = totalHeight * tocScale;
      const startY = pagePadding + tocTitleHeight; // Starting Y position for the scaled diagram after title

      // Add the scaled-down diagram as the background image for the TOC
      const tocImageData = fullDiagramCanvas.toDataURL("image/jpeg", 0.75);
      pdf.addImage(
        tocImageData,
        "JPEG",
        pagePadding,
        startY,
        scaledDiagramWidth,
        scaledDiagramHeight
      );

      // Draw the Grid and Page Numbers on the TOC
      pdf.setFontSize(10);
      pdf.setTextColor(255, 0, 0);

      const cellWidth = scaledDiagramWidth / cols;
      const cellHeight = scaledDiagramHeight / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pageNumber = r * cols + c + 2;

          // Calculate position using the corrected cell dimensions
          const x = pagePadding + c * cellWidth;
          const y = startY + r * cellHeight;
          const w = cellWidth;
          const h = cellHeight;

          // Draw the border
          pdf.setDrawColor(0, 0, 0);
          pdf.rect(x, y, w, h);

          if (!renderedPagesNumbers.has(pageNumber)) {
            continue;
          }

          // Add the page number in the center of the cell
          const textString = String(pageNumber);
          const textWidth =
            pdf.getStringUnitWidth(textString) * pdf.getFontSize();
          const textHeight = pdf.getFontSize();

          pdf.text(
            textString,
            x + w / 2 - textWidth / 2, // Centered X
            y + h / 2 + textHeight / 3 // Centered Y (adjusted for baseline)
          );
        }
      }

      // pdf.save("diagram_multi-page.pdf");
      await sendPdfToSalesforceAttachments(pdf);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.action === "pdfSaved") {
        setIsLoading(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <CustomButton
      label="Save as PDF"
      color="green"
      icon={<DownloadIcon />}
      onClick={handleClick}
    />
  );
};

export default DownloadButton;
