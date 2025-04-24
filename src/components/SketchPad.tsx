import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Copy, Download, Eraser, Image, Pencil, Save, Trash } from "lucide-react";

const BRUSH_COLORS = [
  { id: "black", name: "Black", value: "#000000" },
  { id: "red", name: "Red", value: "#ff0000" },
  { id: "blue", name: "Blue", value: "#0000ff" },
  { id: "green", name: "Green", value: "#008000" },
  { id: "yellow", name: "Yellow", value: "#ffff00" },
  { id: "purple", name: "Purple", value: "#800080" },
  { id: "orange", name: "Orange", value: "#ffa500" },
];

const SketchPad = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState([5]);
  const [brushColor, setBrushColor] = useState("black");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [savedDrawings, setSavedDrawings] = useState<string[]>([]);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Increase canvas size and make it more responsive
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        // Make canvas fill the entire container with some padding
        canvas.width = container.clientWidth * 2;
        canvas.height = container.clientHeight * 2;
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientHeight}px`;

        // Set up canvas context
        const context = canvas.getContext("2d");
        if (context) {
          context.scale(2, 2); // Scale for high DPI displays
          context.lineCap = "round";
          context.lineJoin = "round";
          context.strokeStyle = BRUSH_COLORS.find(color => color.id === brushColor)?.value || "#000000";
          context.lineWidth = brushSize[0];
          contextRef.current = context;
        }
      }
    };

    // Initial size setup
    updateCanvasSize();

    // Handle window and container resize
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [brushColor, brushSize]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const { offsetX, offsetY } = event.nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      toast.success("Canvas cleared");
    }
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageData = canvas.toDataURL("image/png");
      setSavedDrawings(prev => [...prev, imageData]);
      toast.success("Drawing saved");
    }
  };

  const copyDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob(blob => {
        if (blob) {
          try {
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]);
            toast.success("Drawing copied to clipboard");
          } catch (err) {
            // Fallback for browsers that don't support ClipboardItem
            const imageUrl = canvas.toDataURL("image/png");
            const tempLink = document.createElement("a");
            tempLink.href = imageUrl;
            tempLink.download = "sketch.png";
            tempLink.click();
            toast.success("Drawing downloaded (clipboard copy not supported in your browser)");
          }
        }
      });
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageUrl = canvas.toDataURL("image/png");
      const tempLink = document.createElement("a");
      tempLink.href = imageUrl;
      tempLink.download = "sketch.png";
      tempLink.click();
      toast.success("Drawing downloaded");
    }
  };

  return (
    <div className={`fixed right-0 top-1/4 bg-background border-l border-t border-b rounded-l-lg shadow-xl transition-all duration-300 z-10 ${isCollapsed ? 'w-12' : 'w-[650px]'}`}>
      <div className="flex h-full">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-12 w-12 rounded-l-lg border-r"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        
        <div className={`${isCollapsed ? 'hidden' : 'flex flex-col w-full p-4'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              SketchPad
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={copyDrawing} title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={downloadDrawing} title="Download">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={clearCanvas} title="Clear">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Brush Size: {brushSize[0]}</label>
              <Slider
                value={brushSize}
                min={1}
                max={20}
                step={1}
                onValueChange={setBrushSize}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Color</label>
              <Select value={brushColor} onValueChange={setBrushColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {BRUSH_COLORS.map((color) => (
                    <SelectItem key={color.id} value={color.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-4 w-4 rounded-full border" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setBrushColor("black")}>
                <Pencil className="h-4 w-4 mr-2" />
                Draw
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setBrushColor("white")}>
                <Eraser className="h-4 w-4 mr-2" />
                Erase
              </Button>
              <Button variant="outline" className="flex-1" onClick={saveDrawing}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="flex-1 border rounded-lg overflow-hidden bg-white min-h-[500px]">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>
          
          {savedDrawings.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4">
                  <Image className="h-4 w-4 mr-2" />
                  View Saved ({savedDrawings.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Saved Drawings</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-2">
                  {savedDrawings.map((drawing, index) => (
                    <div key={index} className="border rounded-md overflow-hidden relative group">
                      <img src={drawing} alt={`Drawing ${index + 1}`} className="w-full h-auto" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => {
                            const tempLink = document.createElement("a");
                            tempLink.href = drawing;
                            tempLink.download = `sketch-${index + 1}.png`;
                            tempLink.click();
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default SketchPad;
