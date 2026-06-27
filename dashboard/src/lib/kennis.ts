import fs from 'fs';
import path from 'path';

const KENNIS_DIR = 'E:\\MData\\Kennis';

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  file: string;
  tags: string[];
}

export function getAllTasks(): Task[] {
  const tasks: Task[] = [];
  let idCounter = 0;

  function traverseDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'logs' || file === '.obsidian' || file.startsWith('.')) continue; // skip

      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line) => {
          // Match standard markdown checkboxes: - [ ] or - [x]
          const match = line.match(/^(\s*)-\s*\[([ xX])\]\s+(.*)$/);
          if (match) {
            const isCompleted = match[2].toLowerCase() === 'x';
            let taskContent = match[3].trim();
            
            // Extract tags
            const tags: string[] = [];
            const tagMatches = taskContent.match(/#\w+/g);
            if (tagMatches) {
              tagMatches.forEach(tag => tags.push(tag.substring(1)));
            }

            tasks.push({
              id: `task-${idCounter++}`,
              content: taskContent,
              completed: isCompleted,
              file: file.replace('.md', ''),
              tags
            });
          }
        });
      }
    }
  }

  try {
    if (fs.existsSync(KENNIS_DIR)) {
      traverseDir(KENNIS_DIR);
    }
  } catch (err) {
    console.error('Error reading Kennis directory:', err);
  }

  return tasks;
}

export interface GraphNode {
  id: string;
  name: string;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function getVaultGraph(): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeNames = new Set<string>();

  function traverseDir(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'logs' || file === '.obsidian' || file.startsWith('.')) continue;

      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (file.endsWith('.md')) {
        const fileName = file.replace('.md', '');
        if (!nodeNames.has(fileName)) {
          nodeNames.add(fileName);
          nodes.push({ id: fileName, name: fileName, val: 5 }); // Base size
        }

        const content = fs.readFileSync(fullPath, 'utf8');
        // Match standard obsidian [[wikilinks]]
        const linkMatches = content.match(/\[\[(.*?)\]\]/g);
        
        if (linkMatches) {
          linkMatches.forEach(match => {
            let targetName = match.replace(/\[\[|\]\]/g, '').split('|')[0].trim();
            if (targetName) {
              // Ensure target node exists
              if (!nodeNames.has(targetName)) {
                nodeNames.add(targetName);
                nodes.push({ id: targetName, name: targetName, val: 3 }); // Slightly smaller for uncreated files
              }
              links.push({ source: fileName, target: targetName });
            }
          });
        }
      }
    }
  }

  try {
    if (fs.existsSync(KENNIS_DIR)) {
      traverseDir(KENNIS_DIR);
    }
  } catch (err) {
    console.error('Error generating vault graph:', err);
  }

  return { nodes, links };
}
