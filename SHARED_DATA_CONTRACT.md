# YT Analyzer → ScriptWriter Data Contract v1.0

> **Purpose**: This document defines the standardized data format for communication between YouTube Analyzer and ScriptWriter extensions to ensure zero data loss and maximum script quality.

---

## 1. Overview

This data contract ensures that:
- ✅ All analyzer data is preserved during transmission
- ✅ Both extensions can parse the data correctly
- ✅ Backward compatibility is maintained
- ✅ Future fields can be added without breaking changes

---

## 2. Required Fields

These fields **MUST** be present in every analyzer output:

### 2.1 Metadata Object (REQUIRED)

```javascript
metadata: {
  videoId: string,          // YouTube video ID (e.g., "dQw4w9WgXcQ")
  videoTitle: string,       // Full video title
  channel: string,          // Channel name
  views: string,            // View count (formatted, e.g., "1.2M")
  duration: string,         // Video duration (format: "MM:SS" or "HH:MM:SS")
  url: string,              // Full YouTube URL
  analyzedAt: string,       // ISO 8601 timestamp (e.g., "2025-12-07T08:00:00Z")
  analyzerVersion: string   // Analyzer version (e.g., "9.0.0.1")
}
```

**Validation Rules**:
- `videoId`: Non-empty string
- `videoTitle`: Non-empty string, max 100 characters
- `duration`: Format must match `MM:SS` or `HH:MM:SS` pattern
- `analyzedAt`: Valid ISO 8601 timestamp
- `url`: Must start with `https://youtube.com/` or `https://www.youtube.com/`

### 2.2 Raw Analysis (REQUIRED)

```javascript
rawAnalysis: string  // Complete AI-generated analysis text (minimum 100 characters)
```

**Validation Rules**:
- Must be non-empty string
- Minimum length: 100 characters
- Should contain full markdown-formatted analysis

---

## 3. Core Analysis Fields (HIGHLY RECOMMENDED)

These fields should be present for optimal script generation quality:

```javascript
{
  // Video overview and summary
  aboutVideo: string,
  
  // Target audience information
  audience: string | object,
  // If string: Plain text description
  // If object: { demographics: string, psychographics: string }
  
  // Title breakdown and analysis
  titleAnalysis: string,
  
  // Content outline/structure
  videoOutline: string | array,
  // If string: Newline-separated outline
  // If array: Array of outline items
  
  // Opening hook analysis
  openingHook: string | object,
  // If string: Hook text
  // If object: { fullAnalysis: string, quote: string, pattern: string, effectiveness: string }
  
  // Engagement mechanics
  curiosityGaps: string | array,
  // If string: Newline-separated gaps
  // If array: Array of curiosity gap descriptions
  
  // Content structure and framework
  contentStructure: string | object
  // If string: Framework description
  // If object: Structured framework details
}
```

---

## 4. Optional Enhancement Fields

These fields enhance script quality but are not required:

```javascript
{
  callsToAction: string | array,      // CTA analysis
  monetization: string | object,      // Monetization strategies
  viralMechanics: string | object,    // Viral potential analysis
  whatToSteal: string | array,        // Key takeaways/techniques
  metrics: object,                    // Performance metrics
  visualStyle: object | null,         // Visual style preferences for VEO
  keyTakeaways: array,                // Key points
  engagementTechniques: array,        // Engagement strategies
  uniqueAngle: string,                // Unique perspective
  vphScore: number                    // Value per hour score
}
```

---

## 5. Complete Example

```json
{
  "metadata": {
    "videoId": "abc123xyz",
    "videoTitle": "How to Make Money Online in 2025 - Complete Guide",
    "channel": "Money Mastery Pro",
    "views": "1,234,567",
    "duration": "15:30",
    "url": "https://youtube.com/watch?v=abc123xyz",
    "analyzedAt": "2025-12-07T08:00:00Z",
    "analyzerVersion": "9.0.0.1"
  },
  "aboutVideo": "Comprehensive guide to online income strategies for 2025...",
  "audience": "Aspiring entrepreneurs, beginners, digital nomads",
  "titleAnalysis": "Title uses curiosity + year specificity + completeness promise...",
  "videoOutline": "1. Hook\n2. Problem\n3. Solutions\n4. Action Steps\n5. CTA",
  "openingHook": "What if I told you that 2025 could be the year...",
  "curiosityGaps": [
    "Why most people fail (and how to avoid it)",
    "The secret method that works"
  ],
  "contentStructure": "Problem-Agitate-Solution framework",
  "callsToAction": ["Download checklist", "Join community"],
  "monetization": "Course sales + affiliate commissions",
  "rawAnalysis": "### COMPREHENSIVE ANALYSIS\n\n[Full markdown analysis...]"
}
```

---

## 6. Validation Functions

### For YT Analyzer (Before Sending)

```javascript
function validateAnalyzerOutput(data) {
  const errors = [];
  
  // Check required fields
  if (!data.metadata) {
    errors.push('Missing required field: metadata');
  } else {
    if (!data.metadata.videoId) errors.push('Missing metadata.videoId');
    if (!data.metadata.videoTitle) errors.push('Missing metadata.videoTitle');
  }
  
  if (!data.rawAnalysis || data.rawAnalysis.length < 100) {
    errors.push('rawAnalysis must be at least 100 characters');
  }
  
  // Warn about missing recommended fields
  const recommended = ['aboutVideo', 'audience', 'titleAnalysis', 
                       'videoOutline', 'openingHook', 'curiosityGaps'];
  const missing = recommended.filter(f => !data[f]);
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing recommended fields:', missing);
  }
  
  if (errors.length > 0) {
    console.error('❌ Validation failed:', errors);
    return false;
  }
  
  console.log('✅ Data validation passed');
  return true;
}
```

---

*Data Contract v1.0 - Established December 7, 2025*  
*Ensures zero data loss between YT Analyzer and ScriptWriter*
