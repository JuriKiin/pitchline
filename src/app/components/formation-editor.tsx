'use client';

import { useState, useRef, ChangeEvent, FormEvent, DragEvent, TouchEvent, useEffect } from 'react';
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
import { Download, Upload, Plus, Pencil, Trash2, Users, RotateCcw, Save, Share2, Copy, FileArchive, Settings, User } from 'lucide-react';
import FormationCanvas from './formation-canvas';
import { Logo } from './icons';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

export default function FormationEditor() {
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfigs>(initialPlayerConfigs);
  const [playerCount, setPlayerCount] = useState<PlayerCount>('11');
  const [playPhase, setPlayPhase] = useState<PlayPhase>('attacking');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const [editPositionName, setEditPositionName] = useState('');
  const [draggedPlayerId, setDraggedPlayerId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [selectedFormationNames, setSelectedFormationNames] = useState(initialFormationNames);

  const [savedSetups, setSavedSetups] = useLocalStorage<Record<string, FormationSetup>>('footy-formation-setups', {});
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [importExportDialogOpen, setImportExportDialogOpen] = useState(false);
  const [newSetupName, setNewSetupName] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  
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
  }, [toast]);
  
  const players = playerConfigs[playerCount][playPhase];
  const setPlayers = (newPlayers: Player[] | ((prevPlayers: Player[]) => Player[])) => {
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
  };

  const selectedFormationName = selectedFormationNames[playerCount][playPhase];
  const setSelectedFormationName = (name: string) => {
    setSelectedFormationNames(prev => ({ 
      ...prev, 
      [playerCount]: {
        ...prev[playerCount],
        [playPhase]: name
      } 
    }));
  };

  const activePlayers = players.filter(p => !p.isBenched);
  const benchedPlayers = players.filter(p => p.isBenched);

  const handlePlayerCountChange = (value: string) => {
    setPlayerCount(value as PlayerCount);
  };

  const handlePhaseChange = (value: string) => {
    setPlayPhase(value as PlayPhase);
  }

  const handleResetFormation = () => {
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
  };
  
  const handleFormationChange = (formationName: string) => {
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
  };

  const handlePlayerPositionChange = (id: string, position: { x: number; y: number }) => {
    setPlayers(prevPlayers =>
      prevPlayers.map(p => (p.id === id ? { ...p, position, isBenched: false } : p))
    );
    setSelectedFormationName("Custom");
  };

  const handleAddPlayer = () => {
    const newPlayer: Player = {
      id: `p${Date.now()}`,
      name: 'New Player',
      positionName: 'SUB',
      position: { x: 50, y: 50 },
      isBenched: activePlayers.length >= parseInt(playerCount, 10),
    };
    setPlayers(prev => [...prev, newPlayer]);
    if (!newPlayer.isBenched) {
      setSelectedFormationName("Custom");
    }
  };
  
  const handleRemovePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    if (activePlayers.some(p => p.id === id)) {
      setSelectedFormationName("Custom");
    }
  };

  const handleStartEdit = (player: Player) => {
    setEditingPlayer(player);
    setEditName(player.name);
    setEditPositionName(player.positionName);
  };
  
  const handleSaveEdit = (e: FormEvent) => {
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
  };

  const handleExport = () => {
    const data = JSON.stringify({ playerConfigs, selectedFormationNames }, null, 2);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pitchline-formation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportExportDialogOpen(false);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
    setImportExportDialogOpen(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
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
              setSelectedFormationNames(data.selectedFormationNames || selectedFormationNames);
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
  };

  const handleDragStart = (e: DragEvent, playerId: string) => {
    e.dataTransfer.setData("playerId", playerId);
    setDraggedPlayerId(playerId);
  };

  const handleTouchStart = (playerId: string) => {
    setDraggedPlayerId(playerId);
  };

  const handleDropOnPlayer = (e: DragEvent, targetPlayerId: string) => {
    e.preventDefault();
    const sourcePlayerId = e.dataTransfer.getData("playerId") || draggedPlayerId;
    if (sourcePlayerId && sourcePlayerId !== targetPlayerId) {
        handlePlayerSwap(sourcePlayerId, targetPlayerId);
    }
    setDraggedPlayerId(null);
  };

  const handleTouchEndOnPlayer = (e: TouchEvent, targetPlayerId: string) => {
    if (draggedPlayerId && draggedPlayerId !== targetPlayerId) {
        const touch = e.changedTouches[0];
        const endTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        const endPlayerId = endTarget?.closest('[data-player-id]')?.getAttribute('data-player-id');

        if(endPlayerId) {
          handlePlayerSwap(draggedPlayerId, endPlayerId);
        }
    }
    setDraggedPlayerId(null);
  };
  
  const handlePlayerSwap = (sourceId: string, targetId: string) => {
    setPlayers(prev => {
        const sourceIndex = prev.findIndex(p => p.id === sourceId);
        const targetIndex = prev.findIndex(p => p.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) return prev;

        const newPlayers = [...prev];
        const sourcePlayer = newPlayers[sourceIndex];
        const targetPlayer = newPlayers[targetIndex];

        newPlayers[sourceIndex] = targetPlayer;
        newPlayers[targetIndex] = sourcePlayer;

        if (sourcePlayer.isBenched !== targetPlayer.isBenched) {
            newPlayers[sourceIndex] = { ...targetPlayer, isBenched: sourcePlayer.isBenched, position: sourcePlayer.position };
            newPlayers[targetIndex] = { ...sourcePlayer, isBenched: targetPlayer.isBenched, position: targetPlayer.position };
        }

        return newPlayers;
    });

    if(!players.find(p => p.id === sourceId)?.isBenched || !players.find(p => p.id === targetId)?.isBenched){
      setSelectedFormationName("Custom");
    }
  };

  const handleSaveSetup = (e: FormEvent) => {
    e.preventDefault();
    if (!newSetupName) return;

    const newSavedSetups = {
      ...savedSetups,
      [newSetupName]: { playerConfigs, selectedFormationNames }
    };
    setSavedSetups(newSavedSetups);
    toast({ title: "Setup Saved", description: `"${newSetupName}" has been saved.` });
    setSaveDialogOpen(false);
    setNewSetupName('');
  };

  const handleLoadSetup = (name: string) => {
    const setup = savedSetups[name];
    if (setup) {
      setPlayerConfigs(setup.playerConfigs);
      setSelectedFormationNames(setup.selectedFormationNames);
      toast({ title: "Setup Loaded", description: `"${name}" has been loaded.` });
    }
  };

  const handleDeleteSetup = (name: string) => {
    const newSavedSetups = { ...savedSetups };
    delete newSavedSetups[name];
    setSavedSetups(newSavedSetups);
    toast({ title: "Setup Deleted", description: `"${name}" has been deleted.`, variant: "destructive" });
  };

  const handleGenerateShareLink = () => {
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
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast({ title: "Copied!", description: "The shareable link has been copied to your clipboard." });
    }, () => {
      toast({ title: "Error", description: "Failed to copy the link.", variant: "destructive" });
    });
  };

  let currentFormations: Formation[];
  if (playerCount === '6') {
    currentFormations = formations6;
  } else if (playerCount === '7') {
    currentFormations = formations7;
  } else {
    currentFormations = formations11;
  }
  
  const PlayerListItem = ({ player }: { player: Player }) => (
    <li
      key={player.id}
      data-player-id={player.id}
      className="flex items-center gap-2 p-2 rounded-md bg-card hover:bg-muted/50 cursor-grab"
      draggable
      onDragStart={(e) => handleDragStart(e, player.id)}
      onDrop={(e) => handleDropOnPlayer(e, player.id)}
      onDragOver={(e) => e.preventDefault()}
      onTouchStart={() => handleTouchStart(player.id)}
      onTouchEnd={(e) => handleTouchEndOnPlayer(e, player.id)}
    >
      <span className="flex-1 font-medium truncate">{player.name}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => handleStartEdit(player)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Edit Player</p></TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive cursor-pointer" onClick={() => handleRemovePlayer(player.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Remove Player</p></TooltipContent>
      </Tooltip>
    </li>
  );

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
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,application/json" className="hidden" />
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
                                <DropdownMenuItem key={name} onSelect={() => handleLoadSetup(name)} className="flex justify-between items-center">
                                  <span>{name}</span>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteSetup(name);}}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuItem>
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
                              <PlayerListItem key={player.id} player={player} />
                            ))}
                          </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No players on the field.</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Separator />
                    <Card className="border-0 shadow-none rounded-none">
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
                              <PlayerListItem key={player.id} player={player} />
                            ))}
                          </ul>
                          ) : (
                            <p className="text-sm text-muted-foreground">The bench is empty.</p>
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
                <div className="flex justify-center items-center mb-4 gap-4">
                  <Tabs value={playPhase} onValueChange={handlePhaseChange} className="w-full max-w-sm">
                      <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="attacking">Attacking</TabsTrigger>
                          <TabsTrigger value="defending">Defending</TabsTrigger>
                      </TabsList>
                  </Tabs>
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
                        players={activePlayers}
                        previousPlayers={previousPlayerConfig.current?.filter(p => !p.isBenched) || []}
                        onPlayerPositionChange={handlePlayerPositionChange}
                        onPlayerDrop={handleDropOnPlayer}
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
                  <Input id="positionName" value={editPositionName} onChange={(e) => setEditPositionName(e.target.value)} className="col-span-3" />
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
