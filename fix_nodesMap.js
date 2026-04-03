const fs = require('fs');
const file = 'src/components/generative/SignalChainGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

// The replacement logic replaced a block that we didn't intend to duplicate
content = content.replace(
  `  const nodesMap = useMemo(() => {
    return new Map(nodes.map(n => [n.id, n]));
  }, [nodes]);

  const nodesMap = useMemo(() => {
    return new Map(nodes.map(n => [n.id, n]));
  }, [nodes]);

  const [selected, setSelected] = useState<string | null>(null);`,
  `  const nodesMap = useMemo(() => {
    return new Map(nodes.map(n => [n.id, n]));
  }, [nodes]);

  const [selected, setSelected] = useState<string | null>(null);`
);

// We need to make sure nodesMap is only defined once
if (content.match(/const nodesMap = useMemo/g).length > 1) {
  content = content.replace(/  const nodesMap = useMemo\(\(\) => \{\n    return new Map\(nodes\.map\(n => \[n\.id, n\]\)\);\n  \}, \[nodes\]\);\n\n/g, '');
  content = content.replace(
    '  const [selected, setSelected] = useState<string | null>(null);',
    `  const nodesMap = useMemo(() => {
    return new Map(nodes.map(n => [n.id, n]));
  }, [nodes]);

  const [selected, setSelected] = useState<string | null>(null);`
  );
}

// In handleMouseDown we can also utilize the nodesMap instead of Array.find
content = content.replace(
  'const node = nodes.find((n) => n.id === id)!;',
  'const node = nodesMap.get(id)!;'
);

fs.writeFileSync(file, content);
