interface AnalysisResult {
  recommendation: 'SQL' | 'NoSQL';
  confidence: number;
  reasons: string[];
  structure: {
    depth: number;
    hasArrays: boolean;
    hasNestedObjects: boolean;
    consistency: number;
    fieldCount: number;
    relationships: string[];
  };
  suggestedSchema?: any;
}

class JSONAnalyzerService {
  /**
   * Main method to analyze JSON data and recommend database type
   */
  public analyzeJSON(data: any): AnalysisResult {
    const structure = this.analyzeStructure(data);
    const recommendation = this.determineDatabase(structure);

    return {
      ...recommendation,
      structure
    };
  }

  /**
   * Analyze the structure of the JSON data
   */
  private analyzeStructure(data: any) {
    const isArray = Array.isArray(data);
    const dataToAnalyze = isArray ? data[0] : data;

    return {
      depth: this.getMaxDepth(dataToAnalyze),
      hasArrays: this.containsArrays(data),
      hasNestedObjects: this.containsNestedObjects(dataToAnalyze),
      consistency: isArray ? this.checkConsistency(data) : 1,
      fieldCount: Object.keys(dataToAnalyze || {}).length,
      relationships: this.detectRelationships(dataToAnalyze),
      fieldTypes: this.inferFieldTypes(dataToAnalyze)
    };
  }

  /**
   * Calculate maximum depth of nested objects
   */
  private getMaxDepth(obj: any, currentDepth: number = 0): number {
    if (obj === null || typeof obj !== 'object') {
      return currentDepth;
    }

    const depths = Object.values(obj).map(value =>
      this.getMaxDepth(value, currentDepth + 1)
    );

    return depths.length > 0 ? Math.max(...depths) : currentDepth;
  }

  /**
   * Check if data contains arrays
   */
  private containsArrays(data: any): boolean {
    if (Array.isArray(data)) return true;

    if (typeof data === 'object' && data !== null) {
      return Object.values(data).some(value => this.containsArrays(value));
    }

    return false;
  }

  /**
   * Check if data contains nested objects
   */
  private containsNestedObjects(obj: any, depth: number = 0): boolean {
    if (typeof obj !== 'object' || obj === null) return false;

    if (depth > 0) return true;

    return Object.values(obj).some(value =>
      this.containsNestedObjects(value, depth + 1)
    );
  }

  /**
   * Check consistency of array elements (for multiple JSON objects)
   */
  private checkConsistency(dataArray: any[]): number {
    if (!Array.isArray(dataArray) || dataArray.length === 0) return 1;

    const firstKeys = Object.keys(dataArray[0] || {}).sort();
    let consistentCount = 1;

    for (let i = 1; i < dataArray.length; i++) {
      const currentKeys = Object.keys(dataArray[i] || {}).sort();
      if (JSON.stringify(firstKeys) === JSON.stringify(currentKeys)) {
        consistentCount++;
      }
    }

    return consistentCount / dataArray.length;
  }

  /**
   * Detect potential relationships in the data
   */
  private detectRelationships(obj: any): string[] {
    const relationships: string[] = [];

    if (typeof obj !== 'object' || obj === null) return relationships;

    const keys = Object.keys(obj);

    // Look for common relationship patterns
    const relationshipPatterns = [
      /_id$/i,
      /^id$/i,
      /_ref$/i,
      /^user/i,
      /^owner/i,
      /^author/i,
      /^parent/i,
      /^category/i
    ];

    keys.forEach(key => {
      if (relationshipPatterns.some(pattern => pattern.test(key))) {
        relationships.push(key);
      }
    });

    return relationships;
  }

  /**
   * Infer field types from the data
   */
  private inferFieldTypes(obj: any): { [key: string]: string } {
    const types: { [key: string]: string } = {};

    if (typeof obj !== 'object' || obj === null) return types;

    Object.entries(obj).forEach(([key, value]) => {
      types[key] = this.getFieldType(value);
    });

    return types;
  }

  /**
   * Get the type of a field value
   */
  private getFieldType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'integer' : 'float';
    }
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') {
      // Check for date patterns
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
      if (value.length > 255) return 'text';
      return 'string';
    }
    return typeof value;
  }

  /**
   * Determine whether SQL or NoSQL is more appropriate
   */
  private determineDatabase(structure: any): {
    recommendation: 'SQL' | 'NoSQL';
    confidence: number;
    reasons: string[];
  } {
    const reasons: string[] = [];
    let sqlScore = 0;
    let noSqlScore = 0;

    // Factor 1: Data depth (deep nesting favors NoSQL)
    if (structure.depth > 3) {
      noSqlScore += 3;
      reasons.push(`Deep nesting (depth: ${structure.depth}) - NoSQL handles this better`);
    } else if (structure.depth <= 2) {
      sqlScore += 2;
      reasons.push(`Shallow structure (depth: ${structure.depth}) - SQL is efficient`);
    }

    // Factor 2: Arrays (favor NoSQL)
    if (structure.hasArrays) {
      noSqlScore += 2;
      reasons.push('Contains arrays - NoSQL stores arrays natively');
    }

    // Factor 3: Consistency (high consistency favors SQL)
    if (structure.consistency >= 0.9) {
      sqlScore += 3;
      reasons.push(`High consistency (${(structure.consistency * 100).toFixed(0)}%) - SQL works well with structured data`);
    } else if (structure.consistency < 0.7) {
      noSqlScore += 2;
      reasons.push(`Low consistency (${(structure.consistency * 100).toFixed(0)}%) - NoSQL is schema-flexible`);
    }

    // Factor 4: Relationships (favor SQL)
    if (structure.relationships.length > 2) {
      sqlScore += 3;
      reasons.push(`Multiple relationships detected (${structure.relationships.join(', ')}) - SQL excels at joins`);
    } else if (structure.relationships.length === 0) {
      noSqlScore += 1;
      reasons.push('No relationships detected - NoSQL simplifies storage');
    }

    // Factor 5: Field count (many fields favor SQL for querying)
    if (structure.fieldCount > 10) {
      sqlScore += 1;
      reasons.push(`Many fields (${structure.fieldCount}) - SQL provides better query capabilities`);
    } else if (structure.fieldCount < 5) {
      noSqlScore += 1;
      reasons.push(`Few fields (${structure.fieldCount}) - NoSQL is simpler`);
    }

    // Factor 6: Nested objects (favor NoSQL)
    if (structure.hasNestedObjects) {
      noSqlScore += 2;
      reasons.push('Contains nested objects - NoSQL stores documents naturally');
    } else {
      sqlScore += 1;
      reasons.push('Flat structure - SQL handles this efficiently');
    }

    // Determine recommendation and confidence
    const totalScore = sqlScore + noSqlScore;
    const recommendation = sqlScore > noSqlScore ? 'SQL' : 'NoSQL';
    const winningScore = Math.max(sqlScore, noSqlScore);
    const confidence = totalScore > 0 ? Math.round((winningScore / totalScore) * 100) : 50;

    // Add score summary to reasons
    reasons.unshift(`Score: SQL=${sqlScore}, NoSQL=${noSqlScore}`);

    return {
      recommendation,
      confidence,
      reasons
    };
  }

  /**
   * Generate SQL schema suggestion (for future implementation)
   */
  private generateSQLSchema(structure: any, tableName: string = 'data') {
    const fields: string[] = [];

    Object.entries(structure.fieldTypes || {}).forEach(([key, type]: [string, any]) => {
      let sqlType = 'VARCHAR(255)';

      switch (type) {
        case 'integer':
          sqlType = 'INTEGER';
          break;
        case 'float':
          sqlType = 'DECIMAL(10,2)';
          break;
        case 'boolean':
          sqlType = 'BOOLEAN';
          break;
        case 'date':
          sqlType = 'TIMESTAMP';
          break;
        case 'text':
          sqlType = 'TEXT';
          break;
        case 'object':
        case 'array':
          sqlType = 'JSONB';
          break;
      }

      fields.push(`  ${key} ${sqlType}`);
    });

    return `CREATE TABLE ${tableName} (\n  id SERIAL PRIMARY KEY,\n${fields.join(',\n')},\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`;
  }

  /**
   * Generate MongoDB schema suggestion (for future implementation)
   */
  private generateMongoSchema(structure: any, collectionName: string = 'data') {
    const schema: any = {};

    Object.entries(structure.fieldTypes || {}).forEach(([key, type]: [string, any]) => {
      let mongoType = 'String';

      switch (type) {
        case 'integer':
        case 'float':
          mongoType = 'Number';
          break;
        case 'boolean':
          mongoType = 'Boolean';
          break;
        case 'date':
          mongoType = 'Date';
          break;
        case 'array':
          mongoType = 'Array';
          break;
        case 'object':
          mongoType = 'Object';
          break;
      }

      schema[key] = mongoType;
    });

    return {
      collection: collectionName,
      schema,
      example: `const ${collectionName}Schema = new mongoose.Schema(${JSON.stringify(schema, null, 2)});`
    };
  }
}

export default new JSONAnalyzerService();
