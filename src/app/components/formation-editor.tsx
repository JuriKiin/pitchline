'use client';

import { useState, useRef, ChangeEvent, FormEvent, DragEvent } from 'react';
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
import { Download, Upload, Plus, Pencil, Trash2, Users } from 'lucide-react';
import FormationCanvas from './formation-canvas';
import { Logo } from './icons';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';

export default function FormationEditor() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers11);
  const [playerCount, setPlayerCount] = useState<string>('11');
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedFormationName, setSelectedFormationName] = useState<string>(formations11[1].name);

  const activePlayers = players.filter(p => !p.isBenched);
  const benchedPlayers = players.filter(p => p.isBenched);

  const handlePlayerCountChange = (value: string) => {
    setPlayerCount(value);
    let newPlayers: Player[];
    let newFormations: Formation[];
    
    if (value === '6') {
      newPlayers = initialPlayers6;
      newFormations = formations6;
    } else if (value === '7') {
      newPlayers = initialPlayers7;
      newFormations = formations7;
    } else {
      newPlayers = initialPlayers11;
      newFormations = formations11;
    }
    
    setPlayers(newPlayers);
    setSelectedFormationName(newFormations[0].name);
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
      // Keep benched players, but replace active players with formation players
      const currentBenched = players.filter(p => p.isBenched);
      const formationPlayers = formation.players.map(p => ({...p, isBenched: false}));
      const maxActive = parseInt(playerCount, 10);
      
      // If we have too many players, bench some from the old formation
      const combined = [...formationPlayers, ...currentBenched];
      const active = combined.filter(p => !p.isBenched);
      const benched = combined.filter(p => p.isBenched);

      while (active.length > maxActive) {
        const playerToBench = active.pop();
        if(playerToBench) {
          playerToBench.isBenched = true;
          benched.unshift(playerToBench);
        }
      }

      setPlayers([...active, ...benched]);
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
  };
  
  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      setPlayers(prev => prev.map(p => (p.id === editingPlayer.id ? { ...p, name: editName } : p)));
      setEditingPlayer(null);
      setEditName('');
      if (!editingPlayer.isBenched) {
        setSelectedFormationName("Custom");
      }
    }
  };

  const handleExport = () => {
    const data = JSON.stringify({ playerCount, players }, null, 2);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'footy-formation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.playerCount && data.players) {
            setPlayerCount(data.playerCount.toString());
            // Ensure isBenched property exists
            const importedPlayers = data.players.map((p: Player) => ({ ...p, isBenched: p.isBenched || false }));
            setPlayers(importedPlayers);
            setSelectedFormationName("Custom");
            toast({ title: "Success", description: "Formation imported successfully." });
          } else {
            throw new Error("Invalid file format");
          }
        } catch (error) {
          toast({ title: "Import Error", description: "Failed to import formation. The file may be corrupt or in the wrong format.", variant: 'destructive' });
        }
      };
      reader.readAsText(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleDragStart = (e: DragEvent, playerId: string) => {
    e.dataTransfer.setData("playerId", playerId);
  };

  const handleDropOnPlayer = (e: DragEvent, targetPlayerId: string) => {
    e.preventDefault();
    const sourcePlayerId = e.dataTransfer.getData("playerId");
    if (sourcePlayerId === targetPlayerId) return;

    setPlayers(prev => {
      const sourcePlayer = prev.find(p => p.id === sourcePlayerId);
      const targetPlayer = prev.find(p => p.id === targetPlayerId);

      if (!sourcePlayer || !targetPlayer) return prev;

      // Swap their benched status and positions
      return prev.map(p => {
        if (p.id === sourcePlayerId) {
          return { ...p, isBenched: targetPlayer.isBenched, position: targetPlayer.position };
        }
        if (p.id === targetPlayerId) {
          return { ...p, isBenched: sourcePlayer.isBenched, position: sourcePlayer.position };
        }
        return p;
      });
    });
    setSelectedFormationName("Custom");
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
      className="flex items-center gap-2 p-2 rounded-md bg-card hover:bg-muted/50 transition-colors cursor-grab"
      draggable
      onDragStart={(e) => handleDragStart(e, player.id)}
      onDrop={(e) => handleDropOnPlayer(e, player.id)}
      onDragOver={(e) => e.preventDefault()}
    >
      <span className="flex-1 font-medium truncate">{player.name}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => handleStartEdit(player)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>Edit Name</p></TooltipContent>
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

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row h-screen bg-background text-foreground overflow-hidden">
        <aside className="w-full md:w-80 border-b md:border-b-0 md:border-r flex-shrink-0">
          <div className="flex flex-col h-full">
            <header className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">Footy Formation</h1>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleImportClick}>
                      <Upload className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Import Formation</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleExport}>
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Export Formation</p></TooltipContent>
                </Tooltip>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,application/json" className="hidden" />
              </div>
            </header>

            <div className="p-4 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Game Type</Label>
                <Tabs value={playerCount} onValueChange={handlePlayerCountChange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="11">11-a-side</TabsTrigger>
                    <TabsTrigger value="7">7-a-side</TabsTrigger>
                    <TabsTrigger value="6">6-a-side</TabsTrigger>
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
            
            <Separator />

            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <Card className="border-0 shadow-none rounded-none">
                  <CardHeader className="pt-4 pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Starting XI ({activePlayers.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <ul className="space-y-2">
                      {activePlayers.map(player => (
                        <PlayerListItem key={player.id} player={player} />
                      ))}
                    </ul>
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
                      <ul className="space-y-2">
                        {benchedPlayers.map(player => (
                          <PlayerListItem key={player.id} player={player} />
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                
              </ScrollArea>
            </div>

            <div className="p-4 border-t">
              <Button className="w-full" onClick={handleAddPlayer}><Plus className="mr-2 h-4 w-4" /> Add Player</Button>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6 bg-muted/30 dark:bg-card/20">
          <FormationCanvas 
            players={activePlayers} 
            onPlayerPositionChange={handlePlayerPositionChange}
            onPlayerDrop={handleDropOnPlayer}
            />
        </main>

        <Dialog open={!!editingPlayer} onOpenChange={(isOpen) => !isOpen && setEditingPlayer(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Player Name</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} className="col-span-3" autoFocus />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

    