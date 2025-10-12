import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export default function InterimairesFilters({ filters, setFilters }) {
  return (
    <Card className="border-0 shadow-lg shadow-slate-200/50">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher un intérimaire..."
              value={filters.recherche}
              onChange={(e) => setFilters({ ...filters, recherche: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <Select
              value={filters.statut}
              onValueChange={(value) => setFilters({ ...filters, statut: value })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="disponible">Disponibles</SelectItem>
                <SelectItem value="en_mission">En mission</SelectItem>
                <SelectItem value="indisponible">Indisponibles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}