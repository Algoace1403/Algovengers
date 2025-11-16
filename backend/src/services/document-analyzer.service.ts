import fs from 'fs';
import path from 'path';
const pdfParse = require('pdf-parse');
import csv from 'csv-parser';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

interface DocumentAnalysis {
  category: string;
  subcategory: string;
  confidence: number;
  extractedText?: string;
  metadata: {
    wordCount?: number;
    pageCount?: number;
    rowCount?: number;
    columnCount?: number;
    detectedKeywords: string[];
    documentType: string;
  };
}

class DocumentAnalyzerService {
  // Category keywords for intelligent classification
  private categoryKeywords = {
    'Documents/Financial': [
      'invoice', 'receipt', 'payment', 'transaction', 'balance', 'account', 'tax',
      'revenue', 'expense', 'profit', 'budget', 'salary', 'payroll', 'financial',
      'banking', 'credit', 'debit', 'statement', 'quarterly', 'annual report'
    ],
    'Documents/Legal': [
      'contract', 'agreement', 'terms', 'conditions', 'legal', 'law', 'court',
      'clause', 'liability', 'jurisdiction', 'hereby', 'whereas', 'party',
      'attorney', 'litigation', 'plaintiff', 'defendant', 'settlement'
    ],
    'Documents/Business': [
      'proposal', 'presentation', 'meeting', 'agenda', 'minutes', 'strategy',
      'business plan', 'stakeholder', 'roi', 'kpi', 'objective', 'milestone',
      'deliverable', 'timeline', 'project', 'scope', 'requirements'
    ],
    'Documents/Academic': [
      'research', 'study', 'thesis', 'paper', 'journal', 'article', 'abstract',
      'methodology', 'hypothesis', 'conclusion', 'bibliography', 'citation',
      'university', 'professor', 'student', 'assignment', 'course', 'education'
    ],
    'Documents/Technical': [
      'api', 'documentation', 'technical', 'specification', 'architecture',
      'database', 'server', 'code', 'function', 'algorithm', 'implementation',
      'system', 'protocol', 'framework', 'library', 'sdk', 'integration'
    ],
    'Documents/Medical': [
      'patient', 'doctor', 'medical', 'diagnosis', 'treatment', 'prescription',
      'hospital', 'clinic', 'health', 'symptoms', 'medication', 'therapy',
      'surgery', 'lab result', 'blood test', 'x-ray', 'mri', 'ct scan'
    ],
    'Documents/Marketing': [
      'campaign', 'branding', 'marketing', 'advertisement', 'social media',
      'seo', 'analytics', 'conversion', 'engagement', 'audience', 'target',
      'content strategy', 'promotion', 'launch', 'brand awareness'
    ],
    'Documents/HR': [
      'employee', 'recruitment', 'hiring', 'interview', 'resume', 'cv',
      'job description', 'performance', 'appraisal', 'benefits', 'leave',
      'onboarding', 'termination', 'hr policy', 'workplace', 'training'
    ],
    'Documents/Reports': [
      'report', 'analysis', 'summary', 'findings', 'data', 'statistics',
      'metrics', 'performance report', 'quarterly', 'monthly', 'weekly',
      'dashboard', 'trends', 'insights', 'recommendations'
    ],
    'Documents/Personal': [
      'note', 'diary', 'journal', 'reminder', 'todo', 'personal', 'memo',
      'thought', 'idea', 'brainstorm', 'plan', 'goal', 'reflection'
    ]
  };

  /**
   * Main method to analyze any document
   */
  async analyzeDocument(filePath: string, filename: string): Promise<DocumentAnalysis> {
    const ext = path.extname(filename).toLowerCase();

    try {
      switch (ext) {
        case '.pdf':
          return await this.analyzePDF(filePath);
        case '.txt':
          return await this.analyzeTXT(filePath);
        case '.csv':
          return await this.analyzeCSV(filePath);
        case '.docx':
          return await this.analyzeDOCX(filePath);
        case '.xlsx':
        case '.xls':
          return await this.analyzeExcel(filePath);
        default:
          return this.getDefaultCategory(filename);
      }
    } catch (error) {
      console.error(`Error analyzing ${filename}:`, error);
      return this.getDefaultCategory(filename);
    }
  }

  /**
   * Analyze PDF files
   */
  private async analyzePDF(filePath: string): Promise<DocumentAnalysis> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;
    const wordCount = text.split(/\s+/).length;
    const { category, subcategory, confidence, keywords } = this.categorizeByContent(text);

    return {
      category,
      subcategory,
      confidence,
      extractedText: text.substring(0, 500), // First 500 chars
      metadata: {
        wordCount,
        pageCount: pdfData.numpages,
        detectedKeywords: keywords,
        documentType: 'PDF Document'
      }
    };
  }

  /**
   * Analyze TXT files
   */
  private async analyzeTXT(filePath: string): Promise<DocumentAnalysis> {
    const text = fs.readFileSync(filePath, 'utf-8');
    const wordCount = text.split(/\s+/).length;
    const { category, subcategory, confidence, keywords } = this.categorizeByContent(text);

    return {
      category,
      subcategory,
      confidence,
      extractedText: text.substring(0, 500),
      metadata: {
        wordCount,
        detectedKeywords: keywords,
        documentType: 'Text Document'
      }
    };
  }

  /**
   * Analyze CSV files
   */
  private async analyzeCSV(filePath: string): Promise<DocumentAnalysis> {
    return new Promise((resolve) => {
      const rows: any[] = [];
      let headers: string[] = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList: string[]) => {
          headers = headerList;
        })
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          const combinedText = headers.join(' ') + ' ' +
            rows.slice(0, 10).map(row => Object.values(row).join(' ')).join(' ');

          const { category, subcategory, confidence, keywords } =
            this.categorizeByContent(combinedText);

          resolve({
            category,
            subcategory,
            confidence,
            metadata: {
              rowCount: rows.length,
              columnCount: headers.length,
              detectedKeywords: keywords,
              documentType: 'CSV Spreadsheet'
            }
          });
        });
    });
  }

  /**
   * Analyze DOCX files
   */
  private async analyzeDOCX(filePath: string): Promise<DocumentAnalysis> {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    const wordCount = text.split(/\s+/).length;
    const { category, subcategory, confidence, keywords } = this.categorizeByContent(text);

    return {
      category,
      subcategory,
      confidence,
      extractedText: text.substring(0, 500),
      metadata: {
        wordCount,
        detectedKeywords: keywords,
        documentType: 'Word Document'
      }
    };
  }

  /**
   * Analyze Excel files
   */
  private async analyzeExcel(filePath: string): Promise<DocumentAnalysis> {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    const headers = data[0] || [];
    const rowCount = data.length;
    const combinedText = headers.join(' ') + ' ' +
      data.slice(1, 11).map(row => row.join(' ')).join(' ');

    const { category, subcategory, confidence, keywords } =
      this.categorizeByContent(combinedText);

    return {
      category,
      subcategory,
      confidence,
      metadata: {
        rowCount,
        columnCount: headers.length,
        detectedKeywords: keywords,
        documentType: 'Excel Spreadsheet'
      }
    };
  }

  /**
   * Categorize document based on text content using keyword matching
   */
  private categorizeByContent(text: string): {
    category: string;
    subcategory: string;
    confidence: number;
    keywords: string[];
  } {
    const lowerText = text.toLowerCase();
    const scores: { [key: string]: { score: number; matches: string[] } } = {};

    // Score each category based on keyword matches
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      const matches: string[] = [];
      let score = 0;

      for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matchCount = (lowerText.match(regex) || []).length;
        if (matchCount > 0) {
          score += matchCount;
          matches.push(keyword);
        }
      }

      if (score > 0) {
        scores[category] = { score, matches };
      }
    }

    // Find best match
    let bestCategory = 'Documents/General';
    let bestScore = 0;
    let bestMatches: string[] = [];

    for (const [category, { score, matches }] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
        bestMatches = matches;
      }
    }

    // Calculate confidence (0-100)
    const totalWords = text.split(/\s+/).length;
    const confidence = Math.min(100, Math.round((bestScore / totalWords) * 100 * 10));

    const [category, subcategory] = bestCategory.split('/');

    return {
      category,
      subcategory,
      confidence: Math.max(confidence, 30), // Minimum 30% confidence
      keywords: bestMatches.slice(0, 5) // Top 5 keywords
    };
  }

  /**
   * Get default category for unsupported files
   */
  private getDefaultCategory(filename: string): DocumentAnalysis {
    const ext = path.extname(filename).toLowerCase();

    // Categorize by file extension
    const extensionCategories: { [key: string]: string } = {
      '.zip': 'Archives/Compressed',
      '.rar': 'Archives/Compressed',
      '.7z': 'Archives/Compressed',
      '.tar': 'Archives/Compressed',
      '.gz': 'Archives/Compressed',
      '.mp3': 'Media/Audio',
      '.wav': 'Media/Audio',
      '.flac': 'Media/Audio',
      '.mp4': 'Media/Video',
      '.avi': 'Media/Video',
      '.mkv': 'Media/Video',
      '.mov': 'Media/Video',
      '.jpg': 'Media/Images',
      '.jpeg': 'Media/Images',
      '.png': 'Media/Images',
      '.gif': 'Media/Images',
      '.svg': 'Media/Images',
      '.psd': 'Design/Photoshop',
      '.ai': 'Design/Illustrator',
      '.fig': 'Design/Figma',
      '.sketch': 'Design/Sketch',
      '.exe': 'Software/Executables',
      '.dmg': 'Software/Installers',
      '.apk': 'Software/Mobile Apps',
      '.json': 'Data/JSON',
      '.xml': 'Data/XML',
      '.sql': 'Data/Databases',
    };

    const categoryPath = extensionCategories[ext] || 'Other/Miscellaneous';
    const [category, subcategory] = categoryPath.split('/');

    return {
      category,
      subcategory,
      confidence: 100,
      metadata: {
        detectedKeywords: [],
        documentType: ext.substring(1).toUpperCase() + ' File'
      }
    };
  }
}

export default new DocumentAnalyzerService();
