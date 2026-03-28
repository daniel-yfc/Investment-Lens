cat << 'PATCH' > streaming.patch
<<<<<<< SEARCH
export function StreamingTextBlock({ content, isGenerating, className }: StreamingTextBlockProps) {
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none break-words", className)}>
=======
export function StreamingTextBlock({ content, isGenerating, className }: StreamingTextBlockProps) {
  const remarkPlugins = useMemo(() => [remarkGfm], []);

  return (
    <div className={cn("prose prose-sm md:prose-base dark:prose-invert max-w-none break-words min-h-[24px]", className)}>
>>>>>>> REPLACE
PATCH
patch -p0 < streaming.patch
