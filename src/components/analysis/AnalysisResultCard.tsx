import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AnalysisResultCardProps {
  result: {
    ticker: string;
    rating: 'Buy' | 'Hold' | 'Sell' | 'Neutral';
    l1Summary: string;
    l2Details: string;
    l3DeepDive: string;
  };
  language?: 'zh-TW' | 'en';
}

export function AnalysisResultCard({ result, language = 'zh-TW' }: AnalysisResultCardProps) {
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  const getBadgeVariant = (rating: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (rating.toLowerCase()) {
      case 'buy': return 'default';
      case 'hold': return 'secondary';
      case 'sell': return 'destructive';
      default: return 'outline';
    }
  };

  const getTranslation = (key: string) => {
    const translations = {
      'zh-TW': {
        summary: '摘要',
        details: '詳情',
        deepDive: '深度分析',
        showMore: '展開更多',
        showLess: '收起',
      },
      'en': {
        summary: 'Summary',
        details: 'Details',
        deepDive: 'Deep Dive',
        showMore: 'Show More',
        showLess: 'Show Less',
      }
    };
    return translations[language][key as keyof typeof translations['zh-TW']];
  };

  const nextLevel = () => setLevel(prev => (prev < 3 ? prev + 1 : prev) as 1 | 2 | 3);
  const resetLevel = () => setLevel(1);

  return (
    <Card className="w-full max-w-2xl my-4 transition-all duration-300 transform-gpu overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{result.ticker}</CardTitle>
        <Badge variant={getBadgeVariant(result.rating)}>{result.rating}</Badge>
      </CardHeader>

      <CardContent>
        {/* L1 Summary: Always visible */}
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">{getTranslation('summary')}</h4>
            <p className="text-sm mt-1">{result.l1Summary}</p>
          </div>

          {/* L2 Details */}
          <div
            className={`transition-all duration-300 ease-in-out origin-top overflow-hidden ${
              level >= 2 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <h4 className="font-semibold text-sm text-muted-foreground pt-4 border-t">{getTranslation('details')}</h4>
            <p className="text-sm mt-1">{result.l2Details}</p>
          </div>

          {/* L3 Deep Dive */}
          <div
            className={`transition-all duration-500 ease-in-out origin-top overflow-hidden ${
              level === 3 ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <h4 className="font-semibold text-sm text-muted-foreground pt-4 border-t">{getTranslation('deepDive')}</h4>
            <p className="text-sm mt-1">{result.l3DeepDive}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 justify-end">
        {level < 3 ? (
          <Button variant="ghost" size="sm" onClick={nextLevel}>
            {getTranslation('showMore')}
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={resetLevel}>
            {getTranslation('showLess')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
