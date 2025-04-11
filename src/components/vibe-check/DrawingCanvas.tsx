
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Trash2, PenLine, Redo, Download } from "lucide-react";

interface DrawingCanvasProps {
  onDrawingComplete: (url: string | null) => void;
  drawingUrl: string | null;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingComplete, drawingUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [hasDrawn, setHasDrawn] = useState(false);

  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const parentWidth = canvas.parentElement?.clientWidth || window.innerWidth;
    canvas.width = parentWidth;
    canvas.height = 300;
    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = `300px`;

    // Get context and set initial properties
    const context = canvas.getContext("2d");
    if (context) {
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      contextRef.current = context;

      // Fill with white background
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!contextRef.current) return;
    
    setIsDrawing(true);
    setHasDrawn(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const endDrawing = () => {
    if (!contextRef.current || !isDrawing) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // Save the drawing
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onDrawingComplete(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (canvas && context) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
      onDrawingComplete(null);
    }
  };

  const changeTool = (newTool: "pen" | "eraser") => {
    if (!contextRef.current) return;
    
    setTool(newTool);
    
    if (newTool === "pen") {
      contextRef.current.strokeStyle = color;
    } else {
      contextRef.current.strokeStyle = "#ffffff";
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL("image/png");
    
    // Create a temporary link element
    const link = document.createElement("a");
    link.download = "vibe-check-drawing.png";
    link.href = dataUrl;
    link.click();
  };

  // Colors for the color palette
  const colors = [
    "#000000", // Black
    "#E53935", // Red
    "#1E88E5", // Blue
    "#43A047", // Green
    "#FDD835", // Yellow
    "#8E24AA", // Purple
    "#FB8C00", // Orange
    "#FFFFFF", // White
  ];

  return (
    <div className="w-full space-y-3">
      <div className="border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="touch-none w-full h-full cursor-crosshair"
        />
      </div>
      
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex space-x-1">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                if (contextRef.current && tool === "pen") {
                  contextRef.current.strokeStyle = c;
                }
                setTool("pen");
              }}
              className={`w-6 h-6 rounded-full ${
                c === color && tool === "pen" ? "ring-2 ring-offset-2 ring-primary" : ""
              } ${c === "#FFFFFF" ? "border border-gray-300" : ""}`}
              style={{ backgroundColor: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeTool("pen")}
            className={tool === "pen" ? "bg-primary/10 border-primary/50" : ""}
          >
            <PenLine className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeTool("eraser")}
            className={tool === "eraser" ? "bg-primary/10 border-primary/50" : ""}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCanvas}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          {hasDrawn && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveDrawing}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
