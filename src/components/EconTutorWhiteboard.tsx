import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pen,
  Highlighter,
  Eraser,
  Type,
  Square,
  Circle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Maximize2,
  Minimize2,
  Grid,
  Sparkles,
  Plus,
  Zap,
  Share2,
  Check,
  Radio,
  HelpCircle,
  ChevronRight,
  Layers,
  Palette,
  Minus,
  Sliders,
  Move,
  BookOpen
} from 'lucide-react';

export type BoardTheme = 'white' | 'grid' | 'chalkboard' | 'dark';
export type ToolType = 'pen' | 'highlighter' | 'eraser' | 'laser' | 'line' | 'arrow' | 'axis' | 'rect' | 'circle' | 'text';

interface StrokePoint {
  x: number;
  y: number;
  pressure?: number;
}

interface DrawingPath {
  id: string;
  type: 'pen' | 'highlighter' | 'eraser';
  color: string;
  size: number;
  points: StrokePoint[];
}

interface ShapeElement {
  id: string;
  type: 'line' | 'arrow' | 'axis' | 'rect' | 'circle' | 'text' | 'template';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  size: number;
  text?: string;
  templateType?: string;
}

interface BoardSlide {
  id: string;
  title: string;
  paths: DrawingPath[];
  shapes: ShapeElement[];
}

interface EconTutorWhiteboardProps {
  onClose?: () => void;
  initialTopic?: string;
}

const PRESET_COLORS = [
  { name: 'Dark Slate', hex: '#0F172A' },
  { name: 'Royal Blue', hex: '#0284C7' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Forest Green', hex: '#16A34A' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Deep Purple', hex: '#7C3AED' },
  { name: 'Chalk White', hex: '#FFFFFF' },
];

const HIGHLIGHTER_COLORS = [
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Cyan', hex: '#38BDF8' },
  { name: 'Green', hex: '#4ADE80' },
  { name: 'Pink', hex: '#F472B6' },
  { name: 'Orange', hex: '#FB923C' },
];

const STROKE_SIZES = [
  { label: 'Fine (1px)', size: 1.5 },
  { label: 'Standard (3px)', size: 3 },
  { label: 'Bold (6px)', size: 6 },
  { label: 'Marker (12px)', size: 12 },
];

const ECON_QUICK_FORMULAS = [
  { label: 'GDP Equation', text: 'GDP = C + I + G + (X - M)' },
  { label: 'Price Elasticity (PED)', text: 'PED = (%ΔQd) / (%ΔP)' },
  { label: 'Profit Maximization', text: 'MR = MC = P (in Perf. Comp)' },
  { label: 'Money Multiplier', text: 'Multiplier m = 1 / RRR' },
  { label: 'Quantity Theory of Money', text: 'M × V = P × Y' },
  { label: 'Fisher Inflation Equation', text: 'i = r + πᵉ' },
  { label: 'Keynesian Multiplier', text: 'k = 1 / (1 - MPC)' },
  { label: 'National Savings & CA', text: 'CA = (S - I) + (T - G)' },
];

const ECON_TEMPLATES = [
  {
    id: 'supply_demand',
    name: 'Supply & Demand (Micro)',
    desc: 'Equilibrium (P*, Q*) with Demand & Supply Curves and Surplus',
    badge: 'Microeconomics',
  },
  {
    id: 'ad_as',
    name: 'AD-AS Macro Model',
    desc: 'Aggregate Demand, Short-run AS, and Long-run AS (Potential GDP)',
    badge: 'Macroeconomics',
  },
  {
    id: 'is_lm',
    name: 'IS-LM Open Economy Model',
    desc: 'Goods Market (IS) & Money Market (LM) Interest Rate vs Output',
    badge: 'Degree / Advanced',
  },
  {
    id: 'monopoly_cost',
    name: 'Monopoly & Cost Structure',
    desc: 'MC, ATC, MR, and AR/Demand Curves with Deadweight Loss',
    badge: 'Degree / Theory of Firm',
  },
  {
    id: 'ppf',
    name: 'Production Possibilities (PPF)',
    desc: 'Capital vs Consumer Goods with Opportunity Cost Curve',
    badge: 'Foundations',
  },
  {
    id: 'phillips_curve',
    name: 'Phillips Curve (Inflation vs Unemp)',
    desc: 'Short-Run SRPC and Vertical Long-Run LRPC at Natural Rate (Un)',
    badge: 'Monetary Policy',
  },
];

export const EconTutorWhiteboard: React.FC<EconTutorWhiteboardProps> = ({
  onClose,
  initialTopic = 'Macro & Micro Lecture'
}) => {
  // Slides / Multi-board support
  const [slides, setSlides] = useState<BoardSlide[]>([
    { id: 'slide-1', title: 'Board 1: Equilibrium', paths: [], shapes: [] },
  ]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Active tools & styling
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#0F172A');
  const [strokeSize, setStrokeSize] = useState<number>(3);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('white');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiveStreamMode, setIsLiveStreamMode] = useState(true);

  // Redo / Undo stack for the active slide
  const [undoStack, setUndoStack] = useState<{ paths: DrawingPath[]; shapes: ShapeElement[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ paths: DrawingPath[]; shapes: ShapeElement[] }[]>([]);

  // Text insertion state
  const [textInputOpen, setTextInputOpen] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [textCoord, setTextCoord] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  // Template dropdown / modal
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showFormulaDrawer, setShowFormulaDrawer] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const currentPathRef = useRef<DrawingPath | null>(null);
  const tempShapeRef = useRef<ShapeElement | null>(null);

  // Laser Pointer trailing animation ref
  const laserTrailsRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  const currentSlide = slides[activeSlideIndex] || slides[0];

  // Auto-switch default color when dark/chalkboard theme changes
  useEffect(() => {
    if (boardTheme === 'chalkboard' || boardTheme === 'dark') {
      if (selectedColor === '#0F172A') {
        setSelectedColor('#FFFFFF');
      }
    } else {
      if (selectedColor === '#FFFFFF') {
        setSelectedColor('#0F172A');
      }
    }
  }, [boardTheme]);

  // Handle Canvas Resize and High-DPI Display
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set display size
    const width = rect.width;
    const height = Math.max(rect.height, 460);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      redrawCanvas();
    }
  }, [currentSlide, boardTheme]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [handleResize]);

  // Redraw complete canvas including background, grid, templates, shapes, and paths
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // 1. Draw Background
    ctx.clearRect(0, 0, width, height);

    if (boardTheme === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    } else if (boardTheme === 'grid') {
      ctx.fillStyle = '#FAFAF9';
      ctx.fillRect(0, 0, width, height);
      // Draw grid lines
      ctx.strokeStyle = '#E7E5E4';
      ctx.lineWidth = 0.75;
      const gridSize = 24;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    } else if (boardTheme === 'chalkboard') {
      ctx.fillStyle = '#1A3326'; // Deep academic chalkboard green
      ctx.fillRect(0, 0, width, height);
      // Subtle chalkboard texture dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = 0; i < 200; i++) {
        const rx = Math.random() * width;
        const ry = Math.random() * height;
        ctx.fillRect(rx, ry, 2, 2);
      }
    } else if (boardTheme === 'dark') {
      ctx.fillStyle = '#0F172A'; // Midnight Slate
      ctx.fillRect(0, 0, width, height);
      // Subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 30;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    // 2. Draw Permanent Shapes & Economics Models
    currentSlide.shapes.forEach((shape) => {
      drawShapeOnContext(ctx, shape, boardTheme);
    });

    // 3. Draw All Freehand Paths
    currentSlide.paths.forEach((path) => {
      drawPathOnContext(ctx, path);
    });

    // 4. Draw currently active in-progress shape (if user is dragging)
    if (tempShapeRef.current) {
      drawShapeOnContext(ctx, tempShapeRef.current, boardTheme);
    }

    // 5. Draw currently active in-progress stroke
    if (currentPathRef.current) {
      drawPathOnContext(ctx, currentPathRef.current);
    }

    // 6. Draw Laser Pointer Trails (Fade over 600ms)
    if (laserTrailsRef.current.length > 0) {
      const now = Date.now();
      laserTrailsRef.current = laserTrailsRef.current.filter((pt) => now - pt.time < 600);

      laserTrailsRef.current.forEach((pt) => {
        const age = now - pt.time;
        const alpha = Math.max(0, 1 - age / 600);
        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.restore();
      });
    }
  }, [currentSlide, boardTheme]);

  // Animate laser pointer trail
  useEffect(() => {
    let active = true;
    const loop = () => {
      if (laserTrailsRef.current.length > 0) {
        redrawCanvas();
      }
      if (active) {
        animFrameIdRef.current = requestAnimationFrame(loop);
      }
    };
    animFrameIdRef.current = requestAnimationFrame(loop);
    return () => {
      active = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [redrawCanvas]);

  // Helper: Draw freehand path with pressure support
  const drawPathOnContext = (ctx: CanvasRenderingContext2D, path: DrawingPath) => {
    if (!path.points || path.points.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (path.type === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = path.size * 3;
    } else if (path.type === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.38;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.size;
    }

    if (path.points.length === 1) {
      const pt = path.points[0];
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (path.size * (pt.pressure || 1)) / 2, 0, Math.PI * 2);
      ctx.fillStyle = path.color;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      for (let i = 1; i < path.points.length; i++) {
        const p1 = path.points[i - 1];
        const p2 = path.points[i];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }

      ctx.stroke();
    }
    ctx.restore();
  };

  // Helper: Draw geometric shapes, coordinate axes, and economics templates
  const drawShapeOnContext = (ctx: CanvasRenderingContext2D, shape: ShapeElement, currentTheme: BoardTheme) => {
    ctx.save();
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = shape.size || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const { startX, startY, endX, endY } = shape;
    const isDarkBg = currentTheme === 'chalkboard' || currentTheme === 'dark';

    if (shape.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    } else if (shape.type === 'arrow') {
      // Draw line with arrowhead
      const headLength = 14;
      const dx = endX - startX;
      const dy = endY - startY;
      const angle = Math.atan2(dy, dx);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLength * Math.cos(angle - Math.PI / 6),
        endY - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headLength * Math.cos(angle + Math.PI / 6),
        endY - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    } else if (shape.type === 'axis') {
      // Draw Orthogonal Economics Coordinate Axis (Price vs Quantity / Rate vs Output)
      const originX = Math.min(startX, endX);
      const originY = Math.max(startY, endY);
      const topY = Math.min(startY, endY);
      const rightX = Math.max(startX, endX);

      // Y-Axis
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(originX, topY);
      // Arrowhead for Y-axis
      ctx.lineTo(originX - 5, topY + 10);
      ctx.moveTo(originX, topY);
      ctx.lineTo(originX + 5, topY + 10);
      ctx.stroke();

      // X-Axis
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(rightX, originY);
      // Arrowhead for X-axis
      ctx.lineTo(rightX - 10, originY - 5);
      ctx.moveTo(rightX, originY);
      ctx.lineTo(rightX - 10, originY + 5);
      ctx.stroke();

      // Origin label
      ctx.font = 'bold 12px Open Sans, sans-serif';
      ctx.fillText('O', originX - 12, originY + 14);
      ctx.fillText('P (Price / Rate)', originX - 8, topY - 8);
      ctx.fillText('Q (Quantity / GDP)', rightX - 30, originY + 18);
    } else if (shape.type === 'rect') {
      const width = endX - startX;
      const height = endY - startY;
      ctx.strokeRect(startX, startY, width, height);
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === 'text' && shape.text) {
      ctx.font = 'bold 15px Open Sans, sans-serif';
      ctx.fillText(shape.text, startX, startY);
    } else if (shape.type === 'template') {
      renderEconomicsTemplate(ctx, shape, isDarkBg);
    }

    ctx.restore();
  };

  // Dedicated generator for Economics Diagrams & Models
  const renderEconomicsTemplate = (
    ctx: CanvasRenderingContext2D,
    shape: ShapeElement,
    isDarkBg: boolean
  ) => {
    const { startX: ox, startY: oy } = shape;
    const templateId = shape.templateType;

    ctx.save();
    ctx.font = 'bold 12px Open Sans, sans-serif';

    const axisColor = isDarkBg ? '#E2E8F0' : '#0F172A';
    const demandColor = '#0284C7'; // Blue
    const supplyColor = '#DC2626'; // Red
    const eqColor = '#16A34A'; // Green
    const textColor = isDarkBg ? '#F8FAFC' : '#1E293B';

    if (templateId === 'supply_demand') {
      // Draw Axes
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 20);
      ctx.lineTo(ox + 40, oy + 220); // Y axis
      ctx.lineTo(ox + 260, oy + 220); // X axis
      ctx.stroke();

      // Axis Labels
      ctx.fillStyle = textColor;
      ctx.fillText('P (Price)', ox + 30, oy + 12);
      ctx.fillText('Q (Quantity)', ox + 200, oy + 236);

      // Demand Curve (Downward sloping)
      ctx.strokeStyle = demandColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 50);
      ctx.lineTo(ox + 230, oy + 190);
      ctx.stroke();
      ctx.fillStyle = demandColor;
      ctx.fillText('D (Demand)', ox + 234, oy + 196);

      // Supply Curve (Upward sloping)
      ctx.strokeStyle = supplyColor;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 190);
      ctx.lineTo(ox + 230, oy + 50);
      ctx.stroke();
      ctx.fillStyle = supplyColor;
      ctx.fillText('S (Supply)', ox + 234, oy + 54);

      // Equilibrium dashed lines
      const eqX = ox + 145;
      const eqY = oy + 120;
      ctx.strokeStyle = eqColor;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(ox + 40, eqY);
      ctx.lineTo(eqX, eqY);
      ctx.lineTo(eqX, oy + 220);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point E
      ctx.beginPath();
      ctx.arc(eqX, eqY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = eqColor;
      ctx.fill();

      ctx.fillText('E (P*, Q*)', eqX + 6, eqY - 6);
      ctx.fillText('P*', ox + 18, eqY + 4);
      ctx.fillText('Q*', eqX - 6, oy + 234);

      // Title badge
      ctx.font = 'bold 11px Open Sans, sans-serif';
      ctx.fillStyle = isDarkBg ? '#38BDF8' : '#0369A1';
      ctx.fillText('EQUILIBRIUM: Qd = Qs', ox + 70, oy + 32);
    } else if (templateId === 'ad_as') {
      // AD-AS Macroeconomic Model
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 20);
      ctx.lineTo(ox + 40, oy + 220);
      ctx.lineTo(ox + 270, oy + 220);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText('Price Level (P)', ox + 25, oy + 12);
      ctx.fillText('Real GDP (Y)', ox + 210, oy + 236);

      // AD (Down)
      ctx.strokeStyle = demandColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 50);
      ctx.lineTo(ox + 220, oy + 190);
      ctx.stroke();
      ctx.fillStyle = demandColor;
      ctx.fillText('AD', ox + 224, oy + 194);

      // SRAS (Up)
      ctx.strokeStyle = supplyColor;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 190);
      ctx.lineTo(ox + 220, oy + 50);
      ctx.stroke();
      ctx.fillStyle = supplyColor;
      ctx.fillText('SRAS', ox + 224, oy + 54);

      // LRAS (Vertical potential output line)
      const lrasX = ox + 140;
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(lrasX, oy + 30);
      ctx.lineTo(lrasX, oy + 220);
      ctx.stroke();
      ctx.fillStyle = '#D97706';
      ctx.fillText('LRAS (Yf)', lrasX - 22, oy + 24);

      ctx.font = 'bold 11px Open Sans, sans-serif';
      ctx.fillStyle = isDarkBg ? '#FDE047' : '#B45309';
      ctx.fillText('FULL EMPLOYMENT GDP', ox + 70, oy + 248);
    } else if (templateId === 'is_lm') {
      // IS-LM Curve
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 20);
      ctx.lineTo(ox + 40, oy + 220);
      ctx.lineTo(ox + 260, oy + 220);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText('Interest Rate (r)', ox + 25, oy + 12);
      ctx.fillText('Output / Income (Y)', ox + 175, oy + 236);

      // IS Curve (Goods market)
      ctx.strokeStyle = demandColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 60);
      ctx.lineTo(ox + 220, oy + 180);
      ctx.stroke();
      ctx.fillStyle = demandColor;
      ctx.fillText('IS: Y = C+I+G', ox + 180, oy + 196);

      // LM Curve (Money market)
      ctx.strokeStyle = '#7C3AED';
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 180);
      ctx.lineTo(ox + 220, oy + 60);
      ctx.stroke();
      ctx.fillStyle = '#7C3AED';
      ctx.fillText('LM: M/P = L(r,Y)', ox + 170, oy + 54);

      // Eq point
      const eqX = ox + 140;
      const eqY = oy + 120;
      ctx.strokeStyle = eqColor;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(ox + 40, eqY);
      ctx.lineTo(eqX, eqY);
      ctx.lineTo(eqX, oy + 220);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = eqColor;
      ctx.fillText('r*', ox + 22, eqY + 4);
      ctx.fillText('Y*', eqX - 6, oy + 234);
    } else if (templateId === 'monopoly_cost') {
      // Monopoly MR, MC, ATC
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 20);
      ctx.lineTo(ox + 40, oy + 220);
      ctx.lineTo(ox + 260, oy + 220);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText('Costs / Revenue ($)', ox + 25, oy + 12);
      ctx.fillText('Quantity (Q)', ox + 205, oy + 236);

      // Demand / AR
      ctx.strokeStyle = demandColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 40);
      ctx.lineTo(ox + 240, oy + 180);
      ctx.stroke();
      ctx.fillStyle = demandColor;
      ctx.fillText('AR = Demand', ox + 180, oy + 196);

      // MR Curve (Steeper)
      ctx.strokeStyle = '#7C3AED';
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 40);
      ctx.lineTo(ox + 160, oy + 200);
      ctx.stroke();
      ctx.fillStyle = '#7C3AED';
      ctx.fillText('MR', ox + 164, oy + 204);

      // MC Curve (Nike Swoosh)
      ctx.strokeStyle = supplyColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ox + 50, oy + 140);
      ctx.quadraticCurveTo(ox + 80, oy + 180, ox + 220, oy + 40);
      ctx.stroke();
      ctx.fillStyle = supplyColor;
      ctx.fillText('MC', ox + 224, oy + 44);

      // MR=MC intersection circle
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.arc(ox + 105, oy + 130, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('MR = MC', ox + 112, oy + 132);
    } else if (templateId === 'ppf') {
      // Production Possibilities Frontier
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 20);
      ctx.lineTo(ox + 40, oy + 220);
      ctx.lineTo(ox + 260, oy + 220);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText('Capital Goods', ox + 25, oy + 12);
      ctx.fillText('Consumer Goods', ox + 180, oy + 236);

      // Concave PPF curve
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 40);
      ctx.bezierCurveTo(ox + 150, oy + 45, ox + 220, oy + 120, ox + 240, oy + 220);
      ctx.stroke();

      // Points
      ctx.fillStyle = '#16A34A';
      ctx.beginPath();
      ctx.arc(ox + 140, oy + 90, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('A (Efficient)', ox + 148, oy + 92);

      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.arc(ox + 90, oy + 150, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('B (Inefficient)', ox + 98, oy + 152);

      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(ox + 200, oy + 70, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText('C (Unattainable)', ox + 175, oy + 64);
    } else if (templateId === 'phillips_curve') {
      // Phillips Curve
      ctx.strokeStyle = axisColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox + 40, oy + 20);
      ctx.lineTo(ox + 40, oy + 220);
      ctx.lineTo(ox + 260, oy + 220);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.fillText('Inflation Rate (π %)', ox + 20, oy + 12);
      ctx.fillText('Unemployment (u %)', ox + 175, oy + 236);

      // SRPC (Down curve)
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ox + 60, oy + 50);
      ctx.quadraticCurveTo(ox + 100, oy + 150, ox + 230, oy + 190);
      ctx.stroke();
      ctx.fillStyle = '#DC2626';
      ctx.fillText('SRPC', ox + 234, oy + 194);

      // LRPC (Vertical)
      const unX = ox + 130;
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(unX, oy + 30);
      ctx.lineTo(unX, oy + 220);
      ctx.stroke();
      ctx.fillStyle = '#0284C7';
      ctx.fillText('LRPC (Un)', unX - 22, oy + 24);
    }

    ctx.restore();
  };

  // Pointer Event Handlers for Stylus, Apple Pencil, S-Pen, Touch, & Mouse
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 1 };
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure && e.pressure > 0 ? e.pressure : 1;
    return { x, y, pressure };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Capture pointer to prevent losing stylus tracking when swiping fast
    e.currentTarget.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    const { x, y, pressure } = getCanvasCoords(e);

    // Save snapshot to undo stack before new action
    setUndoStack((prev) => [...prev, { paths: [...currentSlide.paths], shapes: [...currentSlide.shapes] }]);
    setRedoStack([]); // reset redo on new action

    if (activeTool === 'laser') {
      laserTrailsRef.current.push({ x, y, time: Date.now() });
      redrawCanvas();
      return;
    }

    if (activeTool === 'text') {
      setTextCoord({ x, y });
      setTextInputOpen(true);
      isDrawingRef.current = false;
      return;
    }

    if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
      currentPathRef.current = {
        id: `path-${Date.now()}`,
        type: activeTool,
        color: selectedColor,
        size: strokeSize,
        points: [{ x, y, pressure }],
      };
      redrawCanvas();
    } else {
      // Shape / Arrow / Axis
      tempShapeRef.current = {
        id: `shape-${Date.now()}`,
        type: activeTool as any,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        color: selectedColor,
        size: strokeSize,
      };
      redrawCanvas();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y, pressure } = getCanvasCoords(e);

    if (activeTool === 'laser') {
      laserTrailsRef.current.push({ x, y, time: Date.now() });
      redrawCanvas();
      return;
    }

    if (!isDrawingRef.current) return;

    if (currentPathRef.current) {
      currentPathRef.current.points.push({ x, y, pressure });
      redrawCanvas();
    } else if (tempShapeRef.current) {
      tempShapeRef.current.endX = x;
      tempShapeRef.current.endY = y;
      redrawCanvas();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    isDrawingRef.current = false;

    if (currentPathRef.current) {
      const finishedPath = currentPathRef.current;
      currentPathRef.current = null;
      setSlides((prev) => {
        const updated = [...prev];
        const target = updated[activeSlideIndex];
        if (target) {
          target.paths = [...target.paths, finishedPath];
        }
        return updated;
      });
      redrawCanvas();
    } else if (tempShapeRef.current) {
      const finishedShape = tempShapeRef.current;
      tempShapeRef.current = null;
      setSlides((prev) => {
        const updated = [...prev];
        const target = updated[activeSlideIndex];
        if (target) {
          target.shapes = [...target.shapes, finishedShape];
        }
        return updated;
      });
      redrawCanvas();
    }
  };

  // Undo / Redo logic
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, { paths: [...currentSlide.paths], shapes: [...currentSlide.shapes] }]);

    setSlides((prev) => {
      const updated = [...prev];
      const target = updated[activeSlideIndex];
      if (target) {
        target.paths = previousState.paths;
        target.shapes = previousState.shapes;
      }
      return updated;
    });
    setTimeout(redrawCanvas, 20);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, { paths: [...currentSlide.paths], shapes: [...currentSlide.shapes] }]);

    setSlides((prev) => {
      const updated = [...prev];
      const target = updated[activeSlideIndex];
      if (target) {
        target.paths = nextState.paths;
        target.shapes = nextState.shapes;
      }
      return updated;
    });
    setTimeout(redrawCanvas, 20);
  };

  // Clear current active board
  const handleClearBoard = () => {
    if (confirm('Clear all drawings and diagrams on this board?')) {
      setUndoStack((prev) => [...prev, { paths: [...currentSlide.paths], shapes: [...currentSlide.shapes] }]);
      setRedoStack([]);
      setSlides((prev) => {
        const updated = [...prev];
        const target = updated[activeSlideIndex];
        if (target) {
          target.paths = [];
          target.shapes = [];
        }
        return updated;
      });
      setTimeout(redrawCanvas, 20);
    }
  };

  // Add new board slide for multi-board lectures
  const handleAddSlide = () => {
    const newSlide: BoardSlide = {
      id: `slide-${Date.now()}`,
      title: `Board ${slides.length + 1}`,
      paths: [],
      shapes: [],
    };
    setSlides((prev) => [...prev, newSlide]);
    setActiveSlideIndex(slides.length);
    setUndoStack([]);
    setRedoStack([]);
    setTimeout(redrawCanvas, 30);
  };

  // Insert text label
  const handleConfirmText = () => {
    if (!textInputValue.trim()) {
      setTextInputOpen(false);
      return;
    }
    const newTextShape: ShapeElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      startX: textCoord.x,
      startY: textCoord.y,
      endX: textCoord.x,
      endY: textCoord.y,
      color: selectedColor,
      size: strokeSize,
      text: textInputValue.trim(),
    };
    setSlides((prev) => {
      const updated = [...prev];
      const target = updated[activeSlideIndex];
      if (target) {
        target.shapes = [...target.shapes, newTextShape];
      }
      return updated;
    });
    setTextInputValue('');
    setTextInputOpen(false);
    setTimeout(redrawCanvas, 20);
  };

  // Insert Economics Template into Canvas
  const handleInsertTemplate = (templateId: string) => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas ? canvas.width / dpr : 380;
    const ch = canvas ? canvas.height / dpr : 460;

    // Centered or top-left placing
    const placeX = Math.max(20, (cw - 300) / 2);
    const placeY = Math.max(30, (ch - 270) / 2);

    const newTemplateShape: ShapeElement = {
      id: `template-${Date.now()}`,
      type: 'template',
      templateType: templateId,
      startX: placeX,
      startY: placeY,
      endX: placeX + 280,
      endY: placeY + 240,
      color: selectedColor,
      size: 2,
    };

    setUndoStack((prev) => [...prev, { paths: [...currentSlide.paths], shapes: [...currentSlide.shapes] }]);
    setRedoStack([]);

    setSlides((prev) => {
      const updated = [...prev];
      const target = updated[activeSlideIndex];
      if (target) {
        target.shapes = [...target.shapes, newTemplateShape];
      }
      return updated;
    });

    setShowTemplatesModal(false);
    setTimeout(redrawCanvas, 30);
  };

  // Download high-resolution PNG snapshot of board for students
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Econ-Tutor-Lecture-Notes-${currentSlide.title.replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();

    setCopiedNotification('Lecture Board PNG Downloaded!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  // Copy formula to board
  const handleInsertFormula = (formulaText: string) => {
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    const cw = canvas ? canvas.width / dpr : 360;
    const ch = canvas ? canvas.height / dpr : 450;

    const newFormulaShape: ShapeElement = {
      id: `formula-${Date.now()}`,
      type: 'text',
      startX: Math.max(40, cw / 2 - 120),
      startY: Math.max(60, ch / 2 - 20),
      endX: 0,
      endY: 0,
      color: selectedColor === '#0F172A' && (boardTheme === 'dark' || boardTheme === 'chalkboard') ? '#FDE047' : '#0284C7',
      size: 16,
      text: formulaText,
    };

    setUndoStack((prev) => [...prev, { paths: [...currentSlide.paths], shapes: [...currentSlide.shapes] }]);
    setRedoStack([]);

    setSlides((prev) => {
      const updated = [...prev];
      const target = updated[activeSlideIndex];
      if (target) {
        target.shapes = [...target.shapes, newFormulaShape];
      }
      return updated;
    });

    setShowFormulaDrawer(false);
    setCopiedNotification('Formula stamped on board!');
    setTimeout(() => setCopiedNotification(null), 2500);
    setTimeout(redrawCanvas, 30);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl border-2 transition-all duration-300 flex flex-col select-none overflow-hidden ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none bg-slate-950 border-0 h-screen w-screen'
          : 'bg-white border-amber-500/70 shadow-xl'
      }`}
    >
      {/* 1. TOP LIVE CLASSROOM STATUS & CONTROL BAR */}
      <div className="bg-[#091527] text-white px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        {/* Left: Live indicator + Title */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-rose-600/90 text-white font-mono font-black text-[9px] sm:text-[10px] uppercase px-2 py-0.5 rounded-full shadow-xs animate-pulse">
            <Radio className="w-3 h-3 animate-ping" />
            <span>LIVE TUTOR BOARD</span>
          </div>
          <span className="text-xs font-bold text-slate-200 hidden sm:inline">
            Stylus & Touch Pen Optimized
          </span>
        </div>

        {/* Center: Slide Switcher Carousel (Multi-board) */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] sm:max-w-xs py-0.5 no-scrollbar">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSlideIndex(idx);
                setUndoStack([]);
                setRedoStack([]);
                setTimeout(redrawCanvas, 20);
              }}
              className={`px-2 py-1 text-[10px] font-mono font-bold rounded-xs transition whitespace-nowrap cursor-pointer ${
                activeSlideIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {s.title}
            </button>
          ))}
          <button
            onClick={handleAddSlide}
            title="Add Next Board Slide"
            className="p-1 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xs transition cursor-pointer flex items-center"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Fullscreen, Snapshot, Close */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => setShowTemplatesModal(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] uppercase px-2 sm:px-2.5 py-1 rounded-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
          >
            <TrendingUp className="w-3 h-3" />
            <span>Diagrams</span>
          </button>

          <button
            onClick={() => setShowFormulaDrawer(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] uppercase px-2 py-1 rounded-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">Formulas</span>
          </button>

          <button
            onClick={handleExportPNG}
            title="Download Notes for Students"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(handleResize, 150);
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Teaching Mode'}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xs transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 transition cursor-pointer ml-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. PRIMARY FLOATING TOOLBAR */}
      <div className="bg-slate-900/95 backdrop-blur-md px-2 py-2 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800 text-white z-10 shadow-md">
        {/* Drawing Tools Group */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-md border border-slate-800 overflow-x-auto no-scrollbar">
          {/* Pen / Stylus */}
          <button
            onClick={() => setActiveTool('pen')}
            title="Fine Stylus Pen"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'pen' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pen className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Pen</span>
          </button>

          {/* Highlighter */}
          <button
            onClick={() => setActiveTool('highlighter')}
            title="Study Highlighter"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'highlighter' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Highlight</span>
          </button>

          {/* Laser Pointer (Live Zoom/Meet pointer) */}
          <button
            onClick={() => setActiveTool('laser')}
            title="Live Laser Pointer (For Online Classes)"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'laser' ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-300" />
            <span className="text-[10px] text-rose-300">Laser</span>
          </button>

          {/* Precision Eraser */}
          <button
            onClick={() => setActiveTool('eraser')}
            title="Eraser"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'eraser' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          {/* Shift Arrow */}
          <button
            onClick={() => setActiveTool('arrow')}
            title="Curve Shift Arrow"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'arrow' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Coordinate Axes */}
          <button
            onClick={() => setActiveTool('axis')}
            title="Coordinate Axis (P vs Q)"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'axis' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>

          {/* Text Tool */}
          <button
            onClick={() => setActiveTool('text')}
            title="Add Text Label / Equilibrium Note"
            className={`p-2 rounded-xs transition cursor-pointer flex items-center gap-1 text-xs font-bold ${
              activeTool === 'text' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Color Palette + Board Theme Selector */}
        <div className="flex items-center gap-2">
          {/* Colors */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-md border border-slate-800">
            {PRESET_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => setSelectedColor(c.hex)}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full transition cursor-pointer border ${
                  selectedColor === c.hex
                    ? 'ring-2 ring-amber-400 scale-110 border-white'
                    : 'border-slate-600 hover:scale-105'
                }`}
              />
            ))}
          </div>

          {/* Stroke Width Picker */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-md border border-slate-800">
            {STROKE_SIZES.map((sz) => (
              <button
                key={sz.size}
                onClick={() => setStrokeSize(sz.size)}
                title={sz.label}
                className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono text-[10px] font-bold transition cursor-pointer ${
                  strokeSize === sz.size ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {sz.size}
              </button>
            ))}
          </div>

          {/* Board Background Surface */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-md border border-slate-800">
            <button
              onClick={() => setBoardTheme('white')}
              title="Clean Whiteboard"
              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-xs transition cursor-pointer ${
                boardTheme === 'white' ? 'bg-white text-slate-950' : 'text-slate-400'
              }`}
            >
              White
            </button>
            <button
              onClick={() => setBoardTheme('grid')}
              title="Econ Graph Grid"
              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-xs transition cursor-pointer ${
                boardTheme === 'grid' ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setBoardTheme('chalkboard')}
              title="Green Lecture Chalkboard"
              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-xs transition cursor-pointer ${
                boardTheme === 'chalkboard' ? 'bg-emerald-600 text-white' : 'text-slate-400'
              }`}
            >
              Chalk
            </button>
            <button
              onClick={() => setBoardTheme('dark')}
              title="Midnight Dark"
              className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-xs transition cursor-pointer ${
                boardTheme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Dark
            </button>
          </div>

          {/* Undo / Redo / Trash */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              title="Undo Action"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              title="Redo Action"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-xs transition cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClearBoard}
              title="Clear Active Board"
              className="p-1.5 bg-rose-900/60 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xs transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE TOUCH / STYLUS DRAWING CANVAS STAGE */}
      <div className="relative flex-1 w-full bg-slate-100 min-h-[460px] sm:min-h-[520px] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full cursor-crosshair touch-none select-none block"
          style={{ touchAction: 'none' }}
        />

        {/* Live Pen / Stylus Helper Prompt */}
        <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-md border border-slate-700/80 pointer-events-none flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Stylus active • Pressure sensitive • Touch disabled for drawing</span>
        </div>

        {/* Floating Notification Toast */}
        {copiedNotification && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-md shadow-2xl animate-bounce flex items-center gap-1.5 z-30">
            <Check className="w-4 h-4" />
            <span>{copiedNotification}</span>
          </div>
        )}

        {/* Text Input Dialog Modal over Canvas */}
        {textInputOpen && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-2xs flex items-center justify-center p-4 z-30">
            <div className="bg-white border-2 border-[#091527] p-4 rounded-xl shadow-2xl w-full max-w-sm space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#0284C7]" />
                  <span>Insert Economics Label / Equation</span>
                </span>
                <button
                  onClick={() => setTextInputOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmText()}
                placeholder="e.g. E1 (P1, Q1), IS-LM Equilibrium, ΔY / ΔG..."
                autoFocus
                className="w-full border-2 border-slate-300 focus:border-[#0284C7] p-2.5 rounded-lg text-sm font-sans outline-none"
              />

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setTextInputOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-md font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmText}
                  className="px-4 py-1.5 bg-[#0284C7] hover:bg-sky-600 text-white rounded-md font-bold text-xs shadow-md cursor-pointer"
                >
                  Place on Board
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. ECONOMICS PRESET DIAGRAM TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white border-2 border-[#091527] rounded-xl shadow-2xl w-full max-w-lg max-h-[90%] flex flex-col overflow-hidden">
            <div className="bg-[#091527] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">Economics Diagram Library</h3>
                  <p className="text-[11px] text-slate-300">Insert 1-tap editable models for lecture demonstration</p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
              {ECON_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleInsertTemplate(tmpl.id)}
                  className="pt-2.5 first:pt-0 group hover:bg-sky-50 p-2.5 rounded-lg border border-transparent hover:border-sky-300 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0284C7]">{tmpl.name}</h4>
                      <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                        {tmpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{tmpl.desc}</p>
                  </div>
                  <button className="bg-slate-900 group-hover:bg-[#0284C7] text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded transition shrink-0 ml-2">
                    Insert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. ECONOMICS FORMULA STAMP DRAWER */}
      {showFormulaDrawer && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-40">
          <div className="bg-white border-2 border-[#091527] rounded-xl shadow-2xl w-full max-w-md max-h-[90%] flex flex-col overflow-hidden">
            <div className="bg-[#091527] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide">Standard Macro & Micro Equations</h3>
                  <p className="text-[11px] text-slate-300">Tap equation to stamp on current whiteboard slide</p>
                </div>
              </div>
              <button
                onClick={() => setShowFormulaDrawer(false)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {ECON_QUICK_FORMULAS.map((formula, idx) => (
                <div
                  key={idx}
                  onClick={() => handleInsertFormula(formula.text)}
                  className="bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 p-2.5 rounded-lg transition cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">{formula.label}</span>
                    <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-amber-900">
                      {formula.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0284C7] group-hover:text-amber-700 uppercase">
                    Stamp +
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
