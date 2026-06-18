import { useEffect, useState } from "react";
import { getMaterials } from "../api/material.api";
import type { Material } from "../types/global.types";

import MaterialList from "../components/materials/MaterialList";
import CreateMaterialModal from "../components/materials/CreateMaterialModal";
import { Plus } from "lucide-react";

const MaterialsPage = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const fetchMaterials = async () => {
    try {
      const data = await getMaterials();
      setMaterials(Array.isArray(data) ? data : []);
    } catch {
      setMaterials([]);
    }
  };

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await getMaterials();
        setMaterials(Array.isArray(data) ? data : []);
      } catch {
        setMaterials([]);
      }
    };

    loadMaterials();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#f9f9f9]">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">Materials</h1>

        <button
          onClick={() => setOpen(true)}
          className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-black text-white
          hover:scale-[1.03] transition shadow-sm
        "
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">Materials</span>
        </button>
      </div>

      <MaterialList materials={materials} />

      <CreateMaterialModal
        open={open}
        onOpenChange={setOpen}
        onCreated={fetchMaterials}
      />
    </div>
  );
};

export default MaterialsPage;
