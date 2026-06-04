import type { Asset, AssetType } from '@/types'

// Storage interface — החלף את המימוש ל-Supabase בעתיד ללא שינוי בשאר הקוד
export interface IStorage {
  save(asset: Omit<Asset, 'id' | 'created_at'>): Promise<Asset>
  list(type?: AssetType): Promise<Asset[]>
  delete(id: string): Promise<void>
}

const STORAGE_KEY = 'cr_studio_gallery'

function getAll(): Asset[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveAll(assets: Asset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assets))
}

export const localStorageStorage: IStorage = {
  async save(asset) {
    const newAsset: Asset = {
      ...asset,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }
    saveAll([newAsset, ...getAll()])
    return newAsset
  },
  async list(type?) {
    const assets = getAll()
    return type ? assets.filter(a => a.type === type) : assets
  },
  async delete(id) {
    saveAll(getAll().filter(a => a.id !== id))
  },
}
