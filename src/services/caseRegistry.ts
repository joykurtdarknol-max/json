import type { CaseData, CaseManifestItem } from '../types/case';

// Automatically discover all case JSON files using Vite's glob import
// Supports /public/cases/case_*.json and /src/cases/case_*.json
const rawCaseModules = import.meta.glob<CaseData>(
  ['/public/cases/case_*.json', '/src/cases/case_*.json', '/cases/case_*.json'], 
  { eager: true, import: 'default' }
);

/**
 * Returns all automatically discovered cases in the project without needing a manual manifest.
 */
export function getDiscoveredCases(): CaseManifestItem[] {
  const discoveredMap = new Map<string, CaseManifestItem>();

  for (const [path, moduleData] of Object.entries(rawCaseModules)) {
    try {
      const data = moduleData as CaseData;
      if (!data || !data.id || !data.title) continue;

      const fileName = path.split('/').pop() || `${data.id}.json`;
      const id = data.id || fileName.replace('.json', '');

      // Derive smart thumbnail
      const thumbnail = (data as any).thumbnail || data.evidences?.[0]?.image || '/assets/pocket_watch.jpg';
      const tag = (data as any).tag || (data.weapons?.[0]?.name ? `CİNAYET // ${data.weapons[0].name.toUpperCase()}` : 'CİNAYET MASASI');

      discoveredMap.set(id, {
        id,
        title: data.title,
        subtitle: data.subtitle || 'Gizemli Cinayet Soruşturması',
        date: data.date || 'Bilinmiyor',
        location: data.location || 'Olay Yeri',
        difficulty: (data as any).difficulty || 'Orta',
        summary: data.summary || '',
        thumbnail,
        isAvailable: true,
        tag,
        filePath: `/cases/${fileName}`
      });
    } catch (err) {
      console.warn(`Error parsing case from ${path}:`, err);
    }
  }

  return Array.from(discoveredMap.values());
}

/**
 * Retrieves bundled case data if already bundled, otherwise returns null.
 */
export function getLoadedCaseById(caseId: string): CaseData | null {
  for (const [, moduleData] of Object.entries(rawCaseModules)) {
    try {
      const data = moduleData as CaseData;
      if (data && data.id === caseId) {
        return data;
      }
    } catch {}
  }
  return null;
}
