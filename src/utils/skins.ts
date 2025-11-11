import { DiceSkin } from '../types';

export const DEFAULT_SKINS: DiceSkin[] = [
  {
    id: 'bronze',
    name: '青铜骰子',
    type: 'builtin',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="512" height="512"%3E%3Cdefs%3E%3ClinearGradient id="bronzeGradient" x1="0" y1="0" x2="100" y2="100"%3E%3Cstop offset="0%25" style="stop-color:%238B6914;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%23CD853F;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%236B4E13;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x="0" y="0" width="512" height="512" fill="url(%23bronzeGradient)"/%3E%3C/svg%3E',
    colors: {
      primary: '#8B6914',
      secondary: '#CD853F',
      tertiary: '#6B4E13',
    },
  },
  {
    id: 'gem',
    name: '宝石骰子',
    type: 'builtin',
    imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="512" height="512"%3E%3Cdefs%3E%3ClinearGradient id="gemGradient" x1="0" y1="0" x2="100" y2="100"%3E%3Cstop offset="0%25" style="stop-color:%236D28D9;stop-opacity:1" /%3E%3Cstop offset="50%25" style="stop-color:%238B5CF6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%233B82F6;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x="0" y="0" width="512" height="512" fill="url(%23gemGradient)"/%3E%3C/svg%3E',
    colors: {
      primary: '#6D28D9',
      secondary: '#8B5CF6',
      tertiary: '#3B82F6',
    },
  },
];

export const getSkinById = (id: string, customSkins: DiceSkin[]): DiceSkin | undefined => {
  const allSkins = [...DEFAULT_SKINS, ...customSkins];
  return allSkins.find((skin) => skin.id === id);
};

export const addCustomSkin = (
  file: File
): Promise<DiceSkin> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      const newSkin: DiceSkin = {
        id: `custom-${Date.now()}`,
        name: file.name.split('.')[0],
        type: 'custom',
        imageUrl,
      };
      resolve(newSkin);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};
