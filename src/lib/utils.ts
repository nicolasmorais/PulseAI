import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ParsedOrderBump {
  name: string;
  price: string;
  type: string;
  targetAudience: string;
  pain: string;
}

export interface ParsedFunnel {
  funnelTitle: string;
  lowTicket: {
    name: string;
    price: string;
    type: string;
    targetAudience: string;
    pain: string;
    copy: string;
  };
  orderBumps: ParsedOrderBump[];
}

export function parseGeneratedIdeas(text: string): ParsedFunnel[] {
  if (!text) return [];

  const funnels = text.split('---').filter(f => f.trim());
  const parsedFunnels: ParsedFunnel[] = [];

  const funnelTitleRegex = /\*\*FUNIL PREDATÓRIO #\d+: "([^"]+)"\*\*/;
  const lowTicketRegex = /\*\*LOW TICKET \(R\$(\d+)\)\*\*\s*- \*\*Nome:\*\* "([^"]+)"\s*- \*\*Tipo:\*\* ([^\r\n]+)\s*- \*\*Público-Alvo:\*\* ([^\r\n]+)\s*- \*\*Dor Principal:\*\* ([^\r\n]+)\s*- \*\*Copy:\*\* "([^"]+)"/;
  const orderBumpRegex = /\*\*ORDER BUMP #\d+ \(R\$([\d,]+)\)\*\*\s*- \*\*Nome:\*\* "([^"]+)"\s*- \*\*Tipo:\*\* ([^\r\n]+)\s*- \*\*Público-Alvo:\*\* ([^\r\n]+)\s*- \*\*Dor Principal:\*\* ([^\r\n]+)/g;

  for (const funnelText of funnels) {
    const funnelTitleMatch = funnelText.match(funnelTitleRegex);
    const lowTicketMatch = funnelText.match(lowTicketRegex);
    
    if (funnelTitleMatch && lowTicketMatch) {
      const funnel: ParsedFunnel = {
        funnelTitle: funnelTitleMatch[1],
        lowTicket: {
          price: lowTicketMatch[1],
          name: lowTicketMatch[2],
          type: lowTicketMatch[3],
          targetAudience: lowTicketMatch[4],
          pain: lowTicketMatch[5],
          copy: lowTicketMatch[6],
        },
        orderBumps: [],
      };

      let match;
      while ((match = orderBumpRegex.exec(funnelText)) !== null) {
        funnel.orderBumps.push({
          price: match[1],
          name: match[2],
          type: match[3],
          targetAudience: match[4],
          pain: match[5],
        });
      }
      
      parsedFunnels.push(funnel);
    }
  }

  return parsedFunnels;
}