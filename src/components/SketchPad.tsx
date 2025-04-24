import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  ChevronLeft, ChevronRight, Copy, Download, Eraser, Image, Pencil, Save, Trash, 
  Undo, Redo, Grid, Wand2, Palette, Layers, Maximize, Minimize, Settings, Share
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const BRUSH_COLORS = [
  { id: "black", name: "Black", value: "#000000" },
  { id: "red", name: "Red", value: "#ff0000" },
  { id: "blue", name: "Blue", value: "#0000ff" },
  { id: "green", name: "Green", value: "#008000" },
  { id: "yellow", name: "Yellow", value: "#ffff00" },
  { id: "purple", name: "Purple", value: "#800080" },
  { id: "orange", name: "Orange", value: "#ffa500" },
  { id: "white", name: "Eraser", value: "#ffffff" },
];

const BRUSH_TYPES = [
  { id: "round", name: "Round" },
  { id: "square", name: "Square" },
  { id: "fuzzy", name: "Fuzzy" },
];

const SketchPad = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState([5]);
  const [brushColor, setBrushColor] = useState("black");
  const [brushType, setBrushType] = useState("round");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [savedDrawings, setSavedDrawings] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showGrid, setShowGrid] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [tabView, setTabView] = useState("draw");
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const touchRef = useRef<{ x: number, y: number } | null>(null);

  const saveToHistory = useCallback(() => {
    if (!canvasRef.current) return;
    
    const currentState = canvasRef.current.toDataURL("image/png");
    
    if (historyIndex >= 0 && historyIndex < history.length - 1) {
      setHistory(prevHistory => prevHistory.slice(0, historyIndex + 1).concat(currentState));
    } else {
      setHistory(prevHistory => [...prevHistory, currentState]);
    }
    
    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth * 2;
        canvas.height = container.clientHeight * 2;
        canvas.style.width = `${container.clientWidth}px`;
        canvas.style.height = `${container.clientHeight}px`;

        const context = canvas.getContext("2d");
        if (context) {
          context.scale(2, 2);
          context.lineCap = brushType === "square" ? "butt" : "round";
          context.lineJoin = "round";
          context.strokeStyle = BRUSH_COLORS.find(color => color.id === brushColor)?.value || "#000000";
          context.lineWidth = brushSize[0];
          
          if (brushType === "fuzzy") {
            context.shadowBlur = brushSize[0] * 0.5;
            context.shadowColor = BRUSH_COLORS.find(color => color.id === brushColor)?.value || "#000000";
          } else {
            context.shadowBlur = 0;
          }
          
          contextRef.current = context;
        }
      }
    };

    updateCanvasSize();

    if (showGrid && contextRef.current) {
      drawGrid();
    }

    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [brushColor, brushSize, brushType, showGrid]);
  
  useEffect(() => {
    if (!contextRef.current) return;
    
    contextRef.current.lineCap = brushType === "square" ? "butt" : "round";
    contextRef.current.strokeStyle = BRUSH_COLORS.find(color => color.id === brushColor)?.value || "#000000";
    contextRef.current.lineWidth = brushSize[0];
    
    if (brushType === "fuzzy") {
      contextRef.current.shadowBlur = brushSize[0] * 0.5;
      contextRef.current.shadowColor = BRUSH_COLORS.find(color => color.id === brushColor)?.value || "#000000";
    } else {
      contextRef.current.shadowBlur = 0;
    }
  }, [brushColor, brushSize, brushType]);
  
  useEffect(() => {
    if (history.length === 0 && canvasRef.current) {
      saveToHistory();
    }
  }, [history.length, saveToHistory]);
  
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    
    if (!canvas || !context) return;
    
    const gridSize = 20;
    const width = canvas.width / 2;
    const height = canvas.height / 2;
    
    context.save();
    
    context.strokeStyle = "#ddd";
    context.lineWidth = 0.5;
    
    for (let x = 0; x <= width; x += gridSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    
    context.restore();
  }, []);

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
      saveToHistory();
    }
  };
  
  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;
    
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    touchRef.current = { x: offsetX, y: offsetY };
  };
  
  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing || !contextRef.current || !touchRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    touchRef.current = { x: offsetX, y: offsetY };
  };
  
  const handleTouchEnd = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
      touchRef.current = null;
      saveToHistory();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      saveToHistory();
      toast.success("Canvas cleared");
      
      if (showGrid) {
        drawGrid();
      }
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
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
              toast.success("Drawing copied to clipboard");
            }).catch(() => {
              const imageUrl = canvas.toDataURL("image/png");
              const tempLink = document.createElement("a");
              tempLink.href = imageUrl;
              tempLink.download = "sketch.png";
              tempLink.click();
              toast.success("Drawing downloaded (clipboard copy not supported in your browser)");
            });
          } catch (err) {
            console.error("Error copying to clipboard:", err);
            toast.error("Could not copy to clipboard");
          }
        }
      }, 'image/png');
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageUrl = canvas.toDataURL("image/png");
      const tempLink = document.createElement("a");
      tempLink.href = imageUrl;
      tempLink.download = `sketch-${new Date().toISOString().slice(0, 10)}.png`;
      tempLink.click();
      toast.success("Drawing downloaded");
    }
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        restoreCanvasState(img.src);
      };
    } else {
      toast.info("Nothing to undo");
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      
      const img = new Image();
      img.src = history[newIndex];
      img.onload = () => {
        restoreCanvasState(img.src);
      };
    } else {
      toast.info("Nothing to redo");
    }
  };
  
  const toggleGrid = () => {
    setShowGrid(prev => {
      const newShowGrid = !prev;
      
      const canvas = canvasRef.current;
      const context = contextRef.current;
      
      if (canvas && context && newShowGrid) {
        drawGrid();
      }
      
      return newShowGrid;
    });
  };
  
  const toggleFullscreen = () => {
    setFullscreen(prev => !prev);
  };

  const restoreCanvasState = useCallback((imageData: string) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
        context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
        
        if (showGrid) {
          drawGrid();
        }
      }
    };
  }, [showGrid, drawGrid]);

  return (
    <div 
      className={`fixed ${fullscreen ? 'inset-0' : 'right-0 top-1/4'} bg-background border-l border-t border-b rounded-l-lg shadow-xl transition-all duration-300 z-10 ${
        fullscreen ? 'w-full h-full' : isCollapsed ? 'w-12' : 'w-1/2'
      }`}
    >
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
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                {fullscreen ? <Minimize /> : <Maximize />}
              </Button>
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
          
          <Tabs value={tabView} onValueChange={setTabView} className="mb-4">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="draw">Draw</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="draw" className="mt-2">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Brush Size: {brushSize[0]}</label>
                  <Slider
                    value={brushSize}
                    min={1}
                    max={50}
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
              
              <div className="mb-4">
                <label className="text-sm font-medium mb-1 block">Brush Type</label>
                <Select value={brushType} onValueChange={setBrushType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select brush type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRUSH_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={undo} disabled={historyIndex <= 0}>
                    <Undo className="h-4 w-4 mr-2" />
                    Undo
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={redo} disabled={historyIndex >= history.length - 1}>
                    <Redo className="h-4 w-4 mr-2" />
                    Redo
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={toggleGrid}>
                    <Grid className="h-4 w-4 mr-2" />
                    {showGrid ? "Hide Grid" : "Show Grid"}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-2">
              {savedDrawings.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-2">
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
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            const img = new Image();
                            img.src = drawing;
                            img.onload = () => {
                              const canvas = canvasRef.current;
                              const context = contextRef.current;
                              if (canvas && context) {
                                context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
                                context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
                                setTabView("draw");
                                saveToHistory();
                              }
                            };
                          }}
                        >
                          <Layers className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No saved drawings yet</p>
                  <p className="text-sm">Use the Save button to store your artwork</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="mt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-grid" className="font-medium">Show grid</Label>
                    <p className="text-sm text-muted-foreground">Display a grid on the canvas</p>
                  </div>
                  <Switch id="show-grid" checked={showGrid} onCheckedChange={toggleGrid} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="fullscreen" className="font-medium">Fullscreen mode</Label>
                    <p className="text-sm text-muted-foreground">Expand to fill the entire screen</p>
                  </div>
                  <Switch id="fullscreen" checked={fullscreen} onCheckedChange={toggleFullscreen} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex-1 border rounded-lg overflow-hidden bg-white min-h-[500px]">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchPad;
