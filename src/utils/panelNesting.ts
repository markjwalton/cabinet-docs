/**
 * Panel Nesting Optimization Feature
 * 
 * This module implements the panel nesting optimization algorithm using
 * the Best-Fit Decreasing (BFD) bin packing approach to minimize waste.
 */

import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient, handleSupabaseError } from './supabase';

// Types for the nesting algorithm
export interface Board {
  id: string;
  name: string;
  width: number;
  height: number;
  thickness: number;
  material: string;
  cost: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Panel {
  id: string;
  name: string;
  width: number;
  height: number;
  component_id: string;
  board_id: string;
  edge_top: boolean;
  edge_right: boolean;
  edge_bottom: boolean;
  edge_left: boolean;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface EdgeTape {
  id: string;
  name: string;
  width: number;
  material: string;
  cost_per_meter: number;
  reel_length: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface PlacedPanel {
  panel: Panel;
  x: number;
  y: number;
  rotated: boolean;
  board_id: string;
}

export interface NestingJob {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  order_id?: string;
  created_at: string;
  updated_at: string;
  panels_count: number;
  boards_used: number;
  material_efficiency: number;
  error_message?: string;
}

export interface NestingLayout {
  id: string;
  job_id: string;
  board_id: string;
  board_index: number;
  width: number;
  height: number;
  material: string;
  created_at: string;
  updated_at: string;
}

export interface NestingPanel {
  id: string;
  layout_id: string;
  panel_id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NestingResult {
  success: boolean;
  job: NestingJob;
  layouts: NestingLayout[];
  panels: NestingPanel[];
  unusedPanels: Panel[];
  materialEfficiency: number;
  boardsUsed: number;
  error?: string;
}

/**
 * Calculate the total edge tape needed for a panel
 * @param panel The panel
 * @returns The total edge tape length in meters
 */
export const calculateEdgeTapeLength = (panel: Panel): number => {
  let totalLength = 0;
  
  if (panel.edge_top) totalLength += panel.width / 1000; // Convert mm to m
  if (panel.edge_right) totalLength += panel.height / 1000;
  if (panel.edge_bottom) totalLength += panel.width / 1000;
  if (panel.edge_left) totalLength += panel.height / 1000;
  
  return totalLength;
};

/**
 * Calculate the total edge tape cost for a panel
 * @param panel The panel
 * @param edgeTape The edge tape
 * @returns The total edge tape cost
 */
export const calculateEdgeTapeCost = (panel: Panel, edgeTape: EdgeTape): number => {
  const length = calculateEdgeTapeLength(panel);
  return length * edgeTape.cost_per_meter;
};

/**
 * Check if a panel can fit in a space
 * @param panel The panel to place
 * @param space The available space
 * @param allowRotation Whether to allow rotation
 * @returns Whether the panel fits and if rotation is needed
 */
export const doesPanelFit = (
  panel: Panel,
  space: Rectangle,
  allowRotation: boolean = true
): { fits: boolean; needsRotation: boolean } => {
  // Check if panel fits without rotation
  if (panel.width <= space.width && panel.height <= space.height) {
    return { fits: true, needsRotation: false };
  }
  
  // Check if panel fits with rotation
  if (allowRotation && panel.height <= space.width && panel.width <= space.height) {
    return { fits: true, needsRotation: true };
  }
  
  // Panel doesn't fit
  return { fits: false, needsRotation: false };
};

/**
 * Find the best position for a panel using Best-Fit Decreasing algorithm
 * @param panel The panel to place
 * @param board The board
 * @param placedPanels Already placed panels
 * @param allowRotation Whether to allow rotation
 * @returns The best position or null if panel doesn't fit
 */
export const findBestPosition = (
  panel: Panel,
  board: Board,
  placedPanels: PlacedPanel[],
  allowRotation: boolean = true
): { x: number; y: number; rotated: boolean } | null => {
  // If no panels placed yet, place at origin
  if (placedPanels.length === 0) {
    return { x: 0, y: 0, rotated: false };
  }
  
  // Start with the entire board
  const usedSpaces: Rectangle[] = [
    { x: 0, y: 0, width: board.width, height: board.height }
  ];
  
  // Remove spaces occupied by placed panels
  for (const placedPanel of placedPanels) {
    const panelWidth = placedPanel.rotated ? placedPanel.panel.height : placedPanel.panel.width;
    const panelHeight = placedPanel.rotated ? placedPanel.panel.width : placedPanel.panel.height;
    
    const panelRect: Rectangle = {
      x: placedPanel.x,
      y: placedPanel.y,
      width: panelWidth,
      height: panelHeight
    };
    
    // Update used spaces
    const newUsedSpaces: Rectangle[] = [];
    
    for (const space of usedSpaces) {
      // If panel doesn't intersect with space, keep the space
      if (
        panelRect.x + panelRect.width <= space.x ||
        panelRect.x >= space.x + space.width ||
        panelRect.y + panelRect.height <= space.y ||
        panelRect.y >= space.y + space.height
      ) {
        newUsedSpaces.push(space);
        continue;
      }
      
      // Split space into up to 4 new spaces
      
      // Space to the left of panel
      if (panelRect.x > space.x) {
        newUsedSpaces.push({
          x: space.x,
          y: space.y,
          width: panelRect.x - space.x,
          height: space.height
        });
      }
      
      // Space to the right of panel
      if (panelRect.x + panelRect.width < space.x + space.width) {
        newUsedSpaces.push({
          x: panelRect.x + panelRect.width,
          y: space.y,
          width: space.x + space.width - (panelRect.x + panelRect.width),
          height: space.height
        });
      }
      
      // Space above panel
      if (panelRect.y > space.y) {
        newUsedSpaces.push({
          x: space.x,
          y: space.y,
          width: space.width,
          height: panelRect.y - space.y
        });
      }
      
      // Space below panel
      if (panelRect.y + panelRect.height < space.y + space.height) {
        newUsedSpaces.push({
          x: space.x,
          y: panelRect.y + panelRect.height,
          width: space.width,
          height: space.y + space.height - (panelRect.y + panelRect.height)
        });
      }
    }
    
    usedSpaces.length = 0;
    usedSpaces.push(...newUsedSpaces);
  }
  
  // Find best space (smallest waste)
  let bestSpace: Rectangle | null = null;
  let bestWaste = Infinity;
  let needsRotation = false;
  
  for (const space of usedSpaces) {
    // Check if panel fits without rotation
    if (panel.width <= space.width && panel.height <= space.height) {
      const waste = (space.width * space.height) - (panel.width * panel.height);
      
      if (waste < bestWaste) {
        bestWaste = waste;
        bestSpace = space;
        needsRotation = false;
      }
    }
    
    // Check if panel fits with rotation
    if (allowRotation && panel.height <= space.width && panel.width <= space.height) {
      const waste = (space.width * space.height) - (panel.width * panel.height);
      
      if (waste < bestWaste) {
        bestWaste = waste;
        bestSpace = space;
        needsRotation = true;
      }
    }
  }
  
  if (bestSpace) {
    return {
      x: bestSpace.x,
      y: bestSpace.y,
      rotated: needsRotation
    };
  }
  
  return null;
};

/**
 * Run the nesting algorithm for a set of panels
 * @param panels The panels to nest
 * @param boards The available boards
 * @param jobName Optional name for the nesting job
 * @param orderId Optional order ID
 * @returns Promise resolving to the nesting result
 */
export const runNestingAlgorithm = async (
  panels: Panel[],
  boards: Board[],
  jobName?: string,
  orderId?: string
): Promise<NestingResult> => {
  try {
    // Sort panels by area (largest first)
    const sortedPanels = [...panels].sort((a, b) => {
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      return areaB - areaA;
    });
    
    // Initialize result
    const result: NestingResult = {
      success: false,
      job: {
        id: '',
        name: jobName || `Nesting Job ${new Date().toISOString()}`,
        status: 'processing',
        order_id: orderId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        panels_count: panels.length,
        boards_used: 0,
        material_efficiency: 0
      },
      layouts: [],
      panels: [],
      unusedPanels: [],
      materialEfficiency: 0,
      boardsUsed: 0
    };
    
    // Create nesting job in database
    const { data: jobData, error: jobError } = await supabaseClient
      .from('nesting_jobs')
      .insert([result.job])
      .select()
      .single();
    
    if (jobError) {
      throw handleSupabaseError(jobError, 'Failed to create nesting job');
    }
    
    result.job = jobData;
    
    // Sort boards by area (smallest first to minimize waste)
    const sortedBoards = [...boards].sort((a, b) => {
      const areaA = a.width * a.height;
      const areaB = b.width * b.height;
      return areaA - areaB;
    });
    
    // Place panels on boards
    const placedPanels: PlacedPanel[] = [];
    const boardsUsed: Record<string, PlacedPanel[]> = {};
    
    for (const panel of sortedPanels) {
      let placed = false;
      
      // Try to place on existing boards first
      for (const boardId of Object.keys(boardsUsed)) {
        const board = boards.find(b => b.id === boardId);
        if (!board) continue;
        
        const position = findBestPosition(panel, board, boardsUsed[boardId]);
        
        if (position) {
          const placedPanel: PlacedPanel = {
            panel,
            x: position.x,
            y: position.y,
            rotated: position.rotated,
            board_id: boardId
          };
          
          placedPanels.push(placedPanel);
          boardsUsed[boardId].push(placedPanel);
          placed = true;
          break;
        }
      }
      
      // If not placed, try a new board
      if (!placed) {
        for (const board of sortedBoards) {
          // Skip if board is already fully used
          if (boardsUsed[board.id] && boardsUsed[board.id].length > 0) continue;
          
          const position = findBestPosition(panel, board, []);
          
          if (position) {
            const placedPanel: PlacedPanel = {
              panel,
              x: position.x,
              y: position.y,
              rotated: position.rotated,
              board_id: board.id
            };
            
            placedPanels.push(placedPanel);
            boardsUsed[board.id] = [placedPanel];
            placed = true;
            break;
          }
        }
      }
      
      // If still not placed, add to unused panels
      if (!placed) {
        result.unusedPanels.push(panel);
      }
    }
    
    // Calculate material efficiency
    let totalBoardArea = 0;
    let totalPanelArea = 0;
    
    for (const boardId of Object.keys(boardsUsed)) {
      const board = boards.find(b => b.id === boardId);
      if (!board) continue;
      
      totalBoardArea += board.width * board.height;
      
      for (const placedPanel of boardsUsed[boardId]) {
        totalPanelArea += placedPanel.panel.width * placedPanel.panel.height;
      }
    }
    
    const materialEfficiency = totalBoardArea > 0 
      ? (totalPanelArea / totalBoardArea) * 100 
      : 0;
    
    // Create layouts and panels in database
    for (const boardId of Object.keys(boardsUsed)) {
      const board = boards.find(b => b.id === boardId);
      if (!board) continue;
      
      // Create layout
      const layout: Omit<NestingLayout, 'id' | 'created_at' | 'updated_at'> = {
        job_id: result.job.id,
        board_id: boardId,
        board_index: result.layouts.length,
        width: board.width,
        height: board.height,
        material: board.material
      };
      
      const { data: layoutData, error: layoutError } = await supabaseClient
        .from('nesting_layouts')
        .insert([layout])
        .select()
        .single();
      
      if (layoutError) {
        throw handleSupabaseError(layoutError, 'Failed to create nesting layout');
      }
      
      result.layouts.push(layoutData);
      
      // Create panels
      for (const placedPanel of boardsUsed[boardId]) {
        const nestingPanel: Omit<NestingPanel, 'id' | 'created_at' | 'updated_at'> = {
          layout_id: layoutData.id,
          panel_id: placedPanel.panel.id,
          x: placedPanel.x,
          y: placedPanel.y,
          width: placedPanel.rotated ? placedPanel.panel.height : placedPanel.panel.width,
          height: placedPanel.rotated ? placedPanel.panel.width : placedPanel.panel.height,
          rotated: placedPanel.rotated
        };
        
        const { data: panelData, error: panelError } = await supabaseClient
          .from('nesting_panels')
          .insert([nestingPanel])
          .select()
          .single();
        
        if (panelError) {
          throw handleSupabaseError(panelError, 'Failed to create nesting panel');
        }
        
        result.panels.push(panelData);
      }
    }
    
    // Update job with results
    const updatedJob: Partial<NestingJob> = {
      status: 'completed',
      boards_used: Object.keys(boardsUsed).length,
      material_efficiency: materialEfficiency,
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedJobData, error: updateError } = await supabaseClient
      .from('nesting_jobs')
      .update(updatedJob)
      .eq('id', result.job.id)
      .select()
      .single();
    
    if (updateError) {
      throw handleSupabaseError(updateError, 'Failed to update nesting job');
    }
    
    result.job = updatedJobData;
    result.materialEfficiency = materialEfficiency;
    result.boardsUsed = Object.keys(boardsUsed).length;
    result.success = true;
    
    return result;
  } catch (error) {
    // Update job with error
    if (error instanceof Error) {
      try {
        await supabaseClient
          .from('nesting_jobs')
          .update({
            status: 'error',
            error_message: error.message,
            updated_at: new Date().toISOString()
          })
          .eq('id', error.message);
      } catch (updateError) {
        console.error('Failed to update nesting job with error:', updateError);
      }
      
      return {
        success: false,
        job: {
          id: '',
          name: jobName || `Nesting Job ${new Date().toISOString()}`,
          status: 'error',
          order_id: orderId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        panels_count: panels.length,
        boards_used: 0,
        material_efficiency: 0,
        error_message: error.message
        },
        layouts: [],
        panels: [],
        unusedPanels: panels,
        materialEfficiency: 0,
        boardsUsed: 0,
        error: error.message
      };
    }
    
    throw handleSupabaseError(error as Error | PostgrestError, 'An unexpected error occurred in nesting algorithm');
  }
};
