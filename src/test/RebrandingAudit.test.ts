import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Rebranding Audit', () => {
  const legacyStrings = ['Zenith', 'Bank XYZ', 'ANT Shield', 'ANT Buckler', 'ANT ', 'Alibaba', 'Qwen'];
  const srcDir = path.resolve(__dirname, '../');

  const walk = (dir: string, callback: (file: string) => void) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        if (!['node_modules', '.git', 'dist', 'antigravity'].includes(file)) {
          walk(filepath, callback);
        }
      } else if (file.match(/\.(tsx|ts|json|css)$/)) {
        callback(filepath);
      }
    });
  };

  it('should not contain legacy branding strings in source files', () => {
    const violations: string[] = [];
    walk(srcDir, (file) => {
      const content = fs.readFileSync(file, 'utf-8');
      
      // Use regex for whole-word case-insensitive match
      legacyStrings.forEach((str) => {
        const regex = new RegExp(`\\b${str.trim()}\\b`, 'gi');
        if (regex.test(content) && 
            !file.includes('RebrandingAudit.test.ts')) {
          violations.push(`${file}: contains "${str}"`);
        }
      });
    });
    
    expect(violations).toEqual([]);
  });

  it('should use dozn- design tokens in index.css', () => {
    const cssPath = path.resolve(srcDir, 'index.css');
    const content = fs.readFileSync(cssPath, 'utf-8');
    expect(content).toContain('--dozn-navy');
    expect(content).toContain('.dozn-card');
    expect(content).not.toContain('--zenith-primary');
  });
});
