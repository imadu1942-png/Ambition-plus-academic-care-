/**
 * Service to fetch and parse data from multiple Google Spreadsheet JSON endpoints
 */

export interface SubjectRecord {
  name: string;
  marks: number;
}

export type SubjectKey = 'Bangla' | 'English' | 'ICT' | 'Economics';

const SUBJECT_URLS: Record<SubjectKey, string> = {
  Bangla: 'https://docs.google.com/spreadsheets/d/16ku6-Rjsy2mnXf6oCJHk136FDuWb6VAfETirFYetYuo/gviz/tq?tqx=out:json',
  English: 'https://docs.google.com/spreadsheets/d/1UxD8ahw1s9EUmvoS6N1cSMAIXJ2MLkCXBuLoCT04sQY/gviz/tq?tqx=out:json',
  ICT: 'https://docs.google.com/spreadsheets/d/1KnikOoEEqkTQb6xLzpBY6R9lptqLcBnrBZ3fP-hBoKY/gviz/tq?tqx=out:json',
  Economics: 'https://docs.google.com/spreadsheets/d/1HIDy9sMw6JJUWcNcxDZ3NkoAr4bm8IHJg69ud_UXUHg/gviz/tq?tqx=out:json'
};

export const fetchSubjectData = async (subject: SubjectKey): Promise<SubjectRecord[]> => {
  const url = SUBJECT_URLS[subject];
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Google Visualization API returns a string wrapped in a callback
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    if (!data.table || !data.table.rows) return [];

    const rows = data.table.rows;
    const cols = data.table.cols || [];

    // Map column labels to indices
    const nameIndex = cols.findIndex((c: any) => c && c.label && c.label.toLowerCase() === 'name');
    const marksIndex = cols.findIndex((c: any) => c && c.label && (c.label.toLowerCase() === 'marks' || c.label.toLowerCase() === 'score'));

    return rows.map((row: any) => {
      const getVal = (idx: number, fallbackIdx: number) => {
        if (!row || !row.c) return null;
        const actualIdx = idx !== -1 ? idx : fallbackIdx;
        const cell = row.c[actualIdx];
        if (!cell) return null;
        return cell.v ?? cell.f;
      };

      return {
        name: String(getVal(nameIndex, 0) || 'Unknown'),
        marks: Number(getVal(marksIndex, 1) || 0)
      };
    }).sort((a: SubjectRecord, b: SubjectRecord) => b.marks - a.marks);
    
  } catch (error) {
    console.error(`Error fetching ${subject} data:`, error);
    return [];
  }
};
