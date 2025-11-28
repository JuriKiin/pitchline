
'use client';

import { useState, useRef, ChangeEvent, FormEvent, DragEvent, TouchEvent, useEffect, useCallback } from 'react';
import { initialPlayers6, initialPlayers7, initialPlayers11 } from '@/app/lib/initial-data';
import type { Player } from '@/app/lib/types';
import { formations6, formations7, formations11, Formation } from '@/app/lib/formations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Plus, Pencil, Trash2, Users, RotateCcw, Save, Share2, Copy, FileArchive, Settings, User, ImageDown } from 'lucide-react';
import FormationCanvas from './formation-canvas';
import { Logo } from './icons';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import html2canvas from 'html2canvas';
import React from 'react';

type PlayerCount = '11' | '7' | '6';
type PlayPhase = 'attacking' | 'defending';

interface PhasePlayers {
  attacking: Player[];
  defending: Player[];
}

interface PlayerConfigs {
  '11': PhasePlayers;
  '7': PhasePlayers;
  '6': PhasePlayers;
}

interface FormationSetup {
  playerConfigs: PlayerConfigs;
  selectedFormationNames: Record<PlayerCount, Record<PlayPhase, string>>;
}

interface SharedFormation {
  playerCount: PlayerCount;
  config: PhasePlayers;
  formationNames: Record<PlayPhase, string>;
}

const initialFormationNames = {
  '11': { attacking: formations11[1].name, defending: formations11[1].name },
  '7': { attacking: formations7[0].name, defending: formations7[0].name },
  '6': { attacking: formations6[0].name, defending: formations6[0].name },
};

const initialPlayerConfigs: PlayerConfigs = {
  '11': { attacking: initialPlayers11, defending: JSON.parse(JSON.stringify(initialPlayers11)) },
  '7': { attacking: initialPlayers7, defending: JSON.parse(JSON.stringify(initialPlayers7)) },
  '6': { attacking: initialPlayers6, defending: JSON.parse(JSON.stringify(initialPlayers6)) },
};

const positionOptions = [
  "GK", "CB", "LB", "RB", "LWB", "RWB", 
  "CDM", "CM", "CAM", "LM", "RM", 
  "LW", "RW", "ST", "CF", "SUB"
];

const SavedSetupMenuItem = React.memo(({ name, onLoad, onDelete }: { name: string; onLoad: (name: string) => void; onDelete: (name: string) => void; }) => {
  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(name);
  }, [onDelete, name]);

  const handleSelect = useCallback(() => {
    onLoad(name);
  }, [onLoad, name]);

  return (
    <DropdownMenuItem onSelect={handleSelect} className="flex justify-between items-center">
      <span>{name}</span>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={handleDeleteClick}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </DropdownMenuItem>
  );
});
SavedSetupMenuItem.displayName = 'SavedSetupMenuItem';

const PlayerListItem = React.memo(({ 
    player, 
    draggedPlayer, 
    handleDragStart, 
    handleDragEnd, 
    handleDrop, 
    handleTouchStart, 
    handleTouchDrop, 
    onStartEdit, 
    onRemove 
}: { 
    player: Player;
    draggedPlayer: Player | null;
    handleDragStart: (e: DragEvent, player: Player) => void;
    handleDragEnd: () => void;
    handleDrop: (e: DragEvent, playerId: string) => void;
    handleTouchStart: (player: Player) => void;
    handleTouchDrop: (e: TouchEvent, playerId: string) => void;
    onStartEdit: (player: Player) => void;
    onRemove: (id: string) => void;
}) => {
    
    const onEditClick = useCallback(() => {
        onStartEdit(player);
    }, [onStartEdit, player]);

    const onRemoveClick = useCallback(() => {
        onRemove(player.id);
    }, [onRemove, player.id]);

    return (
        <li
            data-player-id={player.id}
            className={cn(
                "flex items-center gap-2 p-2 rounded-md bg-card hover:bg-muted/50 cursor-grab",
                draggedPlayer?.id === player.id && "opacity-50"
            )}
            draggable
            onDragStart={(e) => handleDragStart(e, player)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, player.id)}
            onDragOver={(e) => e.preventDefault()}
            onTouchStart={() => handleTouchStart(player)}
            onTouchEnd={(e) => handleTouchDrop(e, player.id)}
        >
            <span className="flex-1 font-medium truncate">{player.name}</span>
            <span className="text-xs text-muted-foreground w-8 text-center">{player.positionName}</span>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={onEditClick}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Edit Player</p></TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive cursor-pointer" onClick={onRemoveClick}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Remove Player</p></TooltipContent>
            </Tooltip>
        </li>
    );
});
PlayerListItem.displayName = 'PlayerListItem';


export default function FormationEditor() {
  const [playerConfigs, setPlayerConfigs] = useLocalStorage<PlayerConfigs>('footy-formation-configs', initialPlayerConfigs);
  const [playerCount, setPlayerCount] = useState<PlayerCount>('11');
  const [playPhase, setPlayPhase] = useState<PlayPhase>('attacking');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const [editPositionName, setEditPositionName] = useState('');
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [selectedFormationNames, setSelectedFormationNames] = useLocalStorage('footy-formation-names', initialFormationNames);

  const [savedSetups, setSavedSetups] = useLocalStorage<Record<string, FormationSetup>>('footy-formation-setups', {});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [importExportDialogOpen, setImportExportDialogOpen] = useState(false);
  const [newSetupName, setNewSetupName] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [isDraggingOverBench, setIsDraggingOverBench] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = atob(hash);
        const data: SharedFormation = JSON.parse(decoded);
        if (data.playerCount && data.config && data.formationNames) {
          setPlayerCount(data.playerCount);
          setPlayerConfigs(prev => ({
            ...prev,
            [data.playerCount]: data.config,
          }));
          setSelectedFormationNames(prev => ({
            ...prev,
            [data.playerCount]: data.formationNames,
          }));
          toast({ title: "Shared formation loaded!", description: `The ${data.playerCount}v${data.playerCount} formation has been loaded.` });
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      } catch (e) {
        console.error("Failed to load formation from URL hash", e);
        toast({ title: "Error", description: "Could not load the shared formation from the link.", variant: "destructive" });
      }
    }
  }, [toast, setPlayerConfigs, setSelectedFormationNames]);
  
  const players = playerConfigs[playerCount][playPhase];
  const setPlayers = useCallback((newPlayers: Player[] | ((prevPlayers: Player[]) => Player[])) => {
    setPlayerConfigs(prev => {
      const currentPlayers = prev[playerCount][playPhase];
      const updatedPlayers = typeof newPlayers === 'function' ? newPlayers(currentPlayers) : newPlayers;
      return { 
        ...prev, 
        [playerCount]: {
          ...prev[playerCount],
          [playPhase]: updatedPlayers
        } 
      };
    });
  }, [playerCount, playPhase, setPlayerConfigs]);

  const selectedFormationName = selectedFormationNames[playerCount][playPhase];
  const setSelectedFormationName = useCallback((name: string) => {
    setSelectedFormationNames(prev => ({ 
      ...prev, 
      [playerCount]: {
        ...prev[playerCount],
        [playPhase]: name
      } 
    }));
  }, [playerCount, playPhase, setSelectedFormationNames]);

  const activePlayers = players.filter(p => !p.isBenched);
  const benchedPlayers = players.filter(p => p.isBenched);

  const handlePlayerCountChange = (value: string) => {
    setPlayerCount(value as PlayerCount);
  };

  const handlePhaseChange = (value: string) => {
    setPlayPhase(value as PlayPhase);
  }

  const handleResetFormation = useCallback(() => {
    const initialPlayers = playerCount === '11' ? initialPlayers11 : playerCount === '7' ? initialPlayers7 : initialPlayers6;
    const initialFormationName = initialFormationNames[playerCount][playPhase];

    setPlayerConfigs(prev => ({
      ...prev,
      [playerCount]: {
        ...prev[playerCount],
        [playPhase]: JSON.parse(JSON.stringify(initialPlayers))
      }
    }));
    
    setSelectedFormationNames(prev => ({
      ...prev,
      [playerCount]: {
        ...prev[playerCount],
        [playPhase]: initialFormationName
      }
    }));

    toast({ title: "Formation Reset", description: `The ${playPhase} formation has been reset to the default.` });
  }, [playerCount, playPhase, setPlayerConfigs, setSelectedFormationNames, toast]);
  
  const handleFormationChange = useCallback((formationName: string) => {
    let formations: Formation[];
    if (playerCount === '6') {
      formations = formations6;
    } else if (playerCount === '7') {
      formations = formations7;
    } else {
      formations = formations11;
    }

    const formation = formations.find(f => f.name === formationName);
    if (formation) {
      setPlayers(prevPlayers => {
        const activePrevPlayers = prevPlayers.filter(p => !p.isBenched);
        const benchedPrevPlayers = prevPlayers.filter(p => p.isBenched);

        const newActivePlayers = formation.players.map((p, index) => ({
          ...p,
          id: activePrevPlayers[index]?.id || `p${Date.now()}${index}`,
          name: activePrevPlayers[index]?.name || `Player ${index + 1}`,
          positionName: p.positionName,
          isBenched: false,
        }));
        
        return [...newActivePlayers, ...benchedPrevPlayers];
      });

      setSelectedFormationName(formationName);
    }
  }, [playerCount, setPlayers, setSelectedFormationName]);

  const handlePlayerPositionChange = useCallback((id: string, position: { x: number; y: number }) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p => (p.id === id ? { ...p, position, isBenched: false } : p))
    );
    setSelectedFormationName("Custom");
  }, [setPlayers, setSelectedFormationName]);

  const handleAddPlayer = useCallback(() => {
    const newPlayer: Player = {
      id: `p${Date.now()}`,
      name: 'New Player',
      positionName: 'SUB',
      position: { x: 50, y: 50 },
      isBenched: true,
    };
    setPlayers(prev => [...prev, newPlayer]);
  }, [setPlayers]);
  
  const handleRemovePlayer = useCallback((id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    if (activePlayers.some(p => p.id === id)) {
      setSelectedFormationName("Custom");
    }
  }, [setPlayers, setSelectedFormationName, activePlayers]);

  const handleStartEdit = useCallback((player: Player) => {
    setEditingPlayer(player);
    setEditName(player.name);
    setEditPositionName(player.positionName);
  }, []);
  
  const handleSaveEdit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      setPlayers(prev => prev.map(p => (p.id === editingPlayer.id ? { ...p, name: editName, positionName: editPositionName } : p)));
      setEditingPlayer(null);
      setEditName('');
      setEditPositionName('');
      if (!editingPlayer.isBenched) {
        setSelectedFormationName("Custom");
      }
    }
  }, [editingPlayer, editName, editPositionName, setPlayers, setSelectedFormationName]);

  const handleExport = useCallback(() => {
    const data = JSON.stringify({ 
      playerConfigs, 
      selectedFormationNames,
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pitchline-formation.json';
    document.body.appendChild(a);
a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportExportDialogOpen(false);
  }, [playerConfigs, selectedFormationNames]);
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
    setImportExportDialogOpen(false);
  };

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.playerConfigs) {
            const importedConfigs = data.playerConfigs;
            if (importedConfigs['11'] && importedConfigs['7'] && importedConfigs['6'] &&
                importedConfigs['11'].attacking && importedConfigs['11'].defending) {
              setPlayerConfigs(importedConfigs);
              setSelectedFormationNames(data.selectedFormationNames || initialFormationNames);
              toast({ title: "Success", description: "Formations imported successfully." });
            } else {
               throw new Error("Invalid file format");
            }
          } else {
            throw new Error("Invalid file format");
          }
        } catch (error) {
          toast({ title: "Import Error", description: "Failed to import formations. The file may be corrupt or in the wrong format.", variant: 'destructive' });
        }
      };
      reader.readAsText(file);
    }
    if (e.target) e.target.value = '';
  }, [setPlayerConfigs, setSelectedFormationNames, toast]);

  // Drag and Drop Logic
  const handleDragStart = useCallback((e: DragEvent, player: Player) => {
    e.dataTransfer.setData("playerId", player.id);
    setDraggedPlayer(player);
  }, []);

  const handleTouchStart = useCallback((player: Player) => {
    setDraggedPlayer(player);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedPlayer(null);
    setIsDraggingOverBench(false);
  }, []);
  
  const handlePlayerSwap = useCallback((sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    setPlayers(prev => {
        const sourceIndex = prev.findIndex(p => p.id === sourceId);
        const targetIndex = prev.findIndex(p => p.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) return prev;
        
        const newPlayers = [...prev];
        const sourcePlayer = newPlayers[sourceIndex];
        const targetPlayer = newPlayers[targetIndex];

        // The simple swap of all properties.
        newPlayers[sourceIndex] = { ...targetPlayer, id: sourcePlayer.id };
        newPlayers[targetIndex] = { ...sourcePlayer, id: targetPlayer.id };

        return newPlayers;
    });

    if(!players.find(p => p.id === sourceId)?.isBenched || !players.find(p => p.id === targetId)?.isBenched){
      setSelectedFormationName("Custom");
    }
  }, [players, setPlayers, setSelectedFormationName]);

  const handleDrop = useCallback((e: DragEvent, targetPlayerId?: string) => {
    e.preventDefault();
    const sourcePlayerId = e.dataTransfer.getData("playerId");

    if (sourcePlayerId && targetPlayerId) {
        handlePlayerSwap(sourcePlayerId, targetPlayerId);
    } else if (sourcePlayerId) {
        const targetIsCanvas = (e.target as HTMLElement).hasAttribute('data-canvas-dropzone');
        const targetIsBench = (e.target as HTMLElement).closest('[data-bench-dropzone="true"]');

        if (targetIsCanvas) {
            const canvasRect = (e.target as HTMLElement).getBoundingClientRect();
            const x = (e.clientX - canvasRect.left) / canvasRect.width * 100;
            const y = (e.clientY - canvasRect.top) / canvasRect.height * 100;
            handlePlayerPositionChange(sourcePlayerId, { x, y });
        } else if (targetIsBench) {
            setPlayers(prev => prev.map(p => p.id === sourcePlayerId ? { ...p, isBenched: true } : p));
            setSelectedFormationName("Custom");
        }
    }
    setIsDraggingOverBench(false);
    setDraggedPlayer(null);
  }, [handlePlayerSwap, handlePlayerPositionChange, setPlayers, setSelectedFormationName]);

  const handleTouchDrop = useCallback((e: TouchEvent, targetPlayerId?: string) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    const sourcePlayerId = draggedPlayer.id;

    if (targetPlayerId && sourcePlayerId !== targetPlayerId) {
        handlePlayerSwap(sourcePlayerId, targetPlayerId);
    } else {
        const touch = e.changedTouches[0];
        if (!touch) {
          setDraggedPlayer(null);
          setIsDraggingOverBench(false);
          return;
        }
        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetIsBench = targetElement?.closest('[data-bench-dropzone="true"]');
        const targetIsCanvas = targetElement?.hasAttribute('data-canvas-dropzone');

        if (targetIsCanvas) {
            const canvasRect = targetElement.getBoundingClientRect();
            const x = (touch.clientX - canvasRect.left) / canvasRect.width * 100;
            const y = (touch.clientY - canvasRect.top) / canvasRect.height * 100;
            handlePlayerPositionChange(sourcePlayerId, {x, y});
        } else if (targetIsBench) {
            setPlayers(prev => prev.map(p => p.id === sourcePlayerId ? { ...p, isBenched: true } : p));
            setSelectedFormationName("Custom");
        }
    }
    setIsDraggingOverBench(false);
    setDraggedPlayer(null);
  }, [draggedPlayer, handlePlayerSwap, handlePlayerPositionChange, setPlayers, setSelectedFormationName]);


  const handleSaveSetup = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!newSetupName) return;

    const newSavedSetups = {
      ...savedSetups,
      [newSetupName]: { 
        playerConfigs, 
        selectedFormationNames,
      }
    };
    setSavedSetups(newSavedSetups);
    toast({ title: "Setup Saved", description: `"${newSetupName}" has been saved.` });
    setSaveDialogOpen(false);
    setNewSetupName('');
  }, [newSetupName, playerConfigs, selectedFormationNames, savedSetups, setSavedSetups, toast]);

  const handleLoadSetup = useCallback((name: string) => {
    const setup = savedSetups[name];
    if (setup) {
      setPlayerConfigs(setup.playerConfigs);
      setSelectedFormationNames(setup.selectedFormationNames);
      toast({ title: "Setup Loaded", description: `"${name}" has been loaded.` });
    }
  }, [savedSetups, setPlayerConfigs, setSelectedFormationNames, toast]);

  const handleDeleteSetup = useCallback((name: string) => {
    const newSavedSetups = { ...savedSetups };
    delete newSavedSetups[name];
    setSavedSetups(newSavedSetups);
    toast({ title: "Setup Deleted", description: `"${name}" has been deleted.`, variant: "destructive" });
  }, [savedSetups, setSavedSetups, toast]);

  const handleGenerateShareLink = useCallback(() => {
    const data: SharedFormation = { 
      playerCount,
      config: playerConfigs[playerCount],
      formationNames: selectedFormationNames[playerCount],
    };
    const jsonString = JSON.stringify(data);
    const encoded = btoa(jsonString);
    const link = `${window.location.origin}${window.location.pathname}#${encoded}`;
    setShareableLink(link);
    setShareDialogOpen(true);
  }, [playerCount, playerConfigs, selectedFormationNames]);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({ title: "Copied!", description: "The shareable link has been copied to your clipboard." });
    }, () => {
      toast({ title: "Error", description: "Failed to copy the link.", variant: "destructive" });
    });
  }, [shareableLink, toast]);

  const handleExportImage = useCallback(() => {
    const elementToCapture = canvasRef.current;
    if (elementToCapture) {
      const parent = elementToCapture.parentElement;
      if (!parent) return;
  
      const originalBg = parent.style.backgroundColor;
      const originalPadding = parent.style.padding;
  
      parent.style.backgroundColor = '#1A202C';
      parent.style.padding = '2rem';
  
      html2canvas(parent, {
        logging: false,
        useCORS: true,
        scale: 2,
        backgroundColor: '#1A202C'
      }).then(canvas => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'pitchline-formation.png';
        link.href = image;
        link.click();
  
        // Revert styles
        parent.style.backgroundColor = originalBg;
        parent.style.padding = originalPadding;
      });
    }
  }, []);
  

  let currentFormations: Formation[];
  if (playerCount === '6') {
    currentFormations = formations6;
  } else if (playerCount === '7') {
    currentFormations = formations7;
  } else {
    currentFormations = formations11;
  }
  
  const previousPlayerConfig = useRef<Player[]>();
  useEffect(() => {
    previousPlayerConfig.current = players;
  }, [players]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">Pitchline</h1>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleGenerateShareLink}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Share Formation</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setImportExportDialogOpen(true)}>
                      <FileArchive className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Manage Files</p></TooltipContent>
                </Tooltip>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <ScrollArea>
              <Accordion type="multiple" defaultValue={['settings', 'players']} className="w-full">
                <AccordionItem value="settings">
                  <AccordionTrigger className="p-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Settings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 pt-0 space-y-4">
                      <div className='flex items-end gap-2'>
                        <div className='flex-1'>
                          <Label className="text-sm font-medium mb-2 block">Saved Setups</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                <span className="truncate">{Object.keys(savedSetups).length > 0 ? "Load Setup" : "No Setups"}</span> <Users className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64">
                              <DropdownMenuLabel>Load a Saved Setup</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {Object.keys(savedSetups).length > 0 ? Object.keys(savedSetups).map(name => (
                                <SavedSetupMenuItem key={name} name={name} onLoad={handleLoadSetup} onDelete={handleDeleteSetup} />
                              )) : <DropdownMenuItem disabled>No saved setups found.</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" onClick={() => setSaveDialogOpen(true)}>
                              <Save className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Save Current Setup</p></TooltipContent>
                        </Tooltip>
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">Game Type</Label>
                        <Tabs value={playerCount} onValueChange={handlePlayerCountChange}>
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="11">11v11</TabsTrigger>
                            <TabsTrigger value="7">7v7</TabsTrigger>
                            <TabsTrigger value="6">6v6</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Formation</Label>
                        <Select value={selectedFormationName} onValueChange={handleFormationChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select formation" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentFormations.map(f => (
                              <SelectItem key={f.name} value={f.name}>{f.name}</SelectItem>
                            ))}
                            <SelectItem value="Custom" disabled>Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="players">
                  <AccordionTrigger className="p-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Players
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border-0 shadow-none rounded-none">
                      <CardHeader className="pt-0 pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Starting XI ({activePlayers.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        {activePlayers.length > 0 ? (
                          <ul className="space-y-2">
                            {activePlayers.map(player => (
                              <PlayerListItem 
                                key={player.id} 
                                player={player}
                                draggedPlayer={draggedPlayer}
                                handleDragStart={handleDragStart}
                                handleDragEnd={handleDragEnd}
                                handleDrop={handleDrop}
                                handleTouchStart={handleTouchStart}
                                handleTouchDrop={handleTouchDrop}
                                onStartEdit={handleStartEdit}
                                onRemove={handleRemovePlayer}
                              />
                            ))}
                          </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No players on the field.</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Separator />
                    <Card 
                      className={cn("border-0 shadow-none rounded-none transition-colors", isDraggingOverBench && "bg-muted/50")}
                      data-bench-dropzone="true"
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnter={() => setIsDraggingOverBench(true)}
                      onDragLeave={() => setIsDraggingOverBench(false)}
                      onTouchEnd={(e) => handleTouchDrop(e)}
                    >
                      <CardHeader className="pt-4 pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          Bench ({benchedPlayers.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        {benchedPlayers.length > 0 ? (
                          <ul className="space-y-2">
                            {benchedPlayers.map(player => (
                                <PlayerListItem 
                                    key={player.id} 
                                    player={player}
                                    draggedPlayer={draggedPlayer}
                                    handleDragStart={handleDragStart}
                                    handleDragEnd={handleDragEnd}
                                    handleDrop={handleDrop}
                                    handleTouchStart={handleTouchStart}
                                    handleTouchDrop={handleTouchDrop}
                                    onStartEdit={handleStartEdit}
                                    onRemove={handleRemovePlayer}
                                />
                            ))}
                          </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">The bench is empty. Drag players here to bench them.</p>
                          )}
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter>
             <Button className="w-full" onClick={handleAddPlayer}><Plus className="mr-2 h-4 w-4" /> Add Player</Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset>
          <div className="flex-1 flex flex-col h-screen max-h-screen overflow-hidden">
            <header className="p-2 flex items-center gap-2 md:hidden border-b">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Formation Controls</h2>
            </header>

            <main className="flex-1 flex flex-col p-4 md:p-6 bg-muted/30 dark:bg-card/20">
                <div className="flex justify-center items-center mb-4 gap-2">
                  <Tabs value={playPhase} onValueChange={handlePhaseChange} className="w-full max-w-sm">
                      <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="attacking">Attacking</TabsTrigger>
                          <TabsTrigger value="defending">Defending</TabsTrigger>
                      </TabsList>
                  </Tabs>
                   <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleExportImage}>
                        <ImageDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Export as Image</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleResetFormation}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Reset Formation</p></TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex-1">
                    <FormationCanvas 
                        ref={canvasRef}
                        players={activePlayers}
                        previousPlayers={previousPlayerConfig.current?.filter(p => !p.isBenched) || []}
                        onPlayerPositionChange={handlePlayerPositionChange}
                        onPlayerDrop={handleDrop}
                        onTouchDrop={handleTouchDrop}
                        onTouchStart={handleTouchStart}
                        draggedPlayer={draggedPlayer}
                        fieldPattern='stripes-vertical'
                    />
                </div>
            </main>
          </div>
        </SidebarInset>

        <Dialog open={!!editingPlayer} onOpenChange={(isOpen) => !isOpen && setEditingPlayer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Player</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="col-span-3" autoFocus />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="positionName" className="text-right">Position</Label>
                  <Select value={editPositionName} onValueChange={setEditPositionName}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Setup</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveSetup}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="setup-name" className="text-right">Name</Label>
                  <Input id="setup-name" value={newSetupName} onChange={(e) => setNewSetupName(e.target.value)} className="col-span-3" placeholder="e.g., Weekend League Squad" autoFocus />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Your Formation</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2 mt-4">
              <Input value={shareableLink} readOnly />
              <Button type="button" size="icon" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Anyone with the link will be able to view your formation.</p>
          </DialogContent>
        </Dialog>
        
        <Dialog open={importExportDialogOpen} onOpenChange={setImportExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Files</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
               <Button variant="outline" onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import from File
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export to File
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </SidebarProvider>
    </TooltipProvider>
  );
}

    

    