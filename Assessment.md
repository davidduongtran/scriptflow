<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# I want to build a function to assess \& point for generated prompts before sending it to Video production.

That means, after complete generate the Prompts, its quality and content have to be compare with original Scripts \&  the Analysis data to ensure comprehensive storytelling and audience value.  The assessment is 100% like a Senior Director with video editing and video making expertise handle the review.
What are critical prompts/questions needed to build a comprehensive master prompt for this Assessment function in our extension?

This is an excellent quality control step for your video production pipeline. Let me build out the critical assessment framework a Senior Director would use.

## Core Assessment Dimensions

A comprehensive evaluation requires examining **7 key pillars** that determine whether prompts will translate into effective video content:

### 1. Content Fidelity Check

| Question | Purpose |
| :-- | :-- |
| Does every key message from the script have a corresponding visual scene? | Gap detection |
| Are the script's emotional beats preserved in visual form? | Tone alignment |
| Is the narrative flow (Hook → Body → CTA) fully represented? | Structure integrity |
| Are specific phrases/concepts the script emphasizes visualized? | Priority coverage |

### 2. Visual Storytelling Quality

- Are abstract concepts translated into **concrete visual metaphors**? (e.g., "hurt people hurt people" → storm cloud/shadow)
- Do the visuals **show rather than tell**? (avoiding text-heavy scenes)
- Is there visual variety across scenes (camera angles, environments, color palettes)?
- Are the metaphors **universally understandable** or too obscure?


### 3. Technical Consistency Audit

```
□ Frame rate consistency (24fps vs 60fps - pick one)
□ Animation style consistency across all scenes
□ Camera terminology used correctly (50mm, 85mm, etc.)
□ Scene duration totals match target video length
□ Audio/SFX/BGM specifications are realistic and coherent
```


### 4. Character \& Continuity Check

- Is there **ONE clear protagonist** maintained throughout?
- Is the antagonist/supporting cast consistent in appearance and name?
- Do character descriptions remain identical scene-to-scene?
- Are character arcs visible across the scene sequence?


### 5. Pacing \& Timing Analysis

| Script Section | Expected Duration | Prompt Scenes | Calculated Duration |
| :-- | :-- | :-- | :-- |
| Hook | 0:00-0:15 | ? | ? |
| Section 1 | 0:15-1:00 | ? | ? |
| ... | ... | ... | ... |

This reveals **over-representation** (too many scenes for one concept) or **under-representation** (missing coverage).

### 6. Redundancy \& Efficiency

- Are there multiple versions of the same concept that should be consolidated?
- Can any scenes be merged without losing narrative value?
- Is there repetitive visual language that becomes monotonous?


### 7. Production Feasibility

- Are the visual descriptions **achievable** with current AI video tools (Veo, Runway, etc.)?
- Are there overly complex shots that will fail generation?
- Is the level of detail appropriate (not too vague, not impossibly specific)?

***

## Master Prompt Template for Assessment Function

```markdown
## ROLE
You are a Senior Director with 15+ years of video editing and production expertise. 
You assess AI video prompts for quality, completeness, and production readiness.

## INPUTS
1. **Original Script**: [The complete narrative script with timing markers]
2. **Analysis Data**: [Audience insights, key themes, emotional targets]
3. **Generated Prompts**: [The Veo/video prompts to evaluate]

## ASSESSMENT CRITERIA (Score 1-10 each)

### A. CONTENT COVERAGE (Weight: 25%)
- [ ] All script sections have corresponding scenes
- [ ] Key messages are visually represented
- [ ] No critical content gaps
- [ ] Hook and CTA are properly visualized

### B. VISUAL STORYTELLING (Weight: 20%)
- [ ] Abstract concepts have clear visual metaphors
- [ ] Show-don't-tell principle applied
- [ ] Visual variety prevents monotony
- [ ] Metaphors are audience-appropriate

### C. TECHNICAL CONSISTENCY (Weight: 15%)
- [ ] Single frame rate throughout
- [ ] Consistent animation style
- [ ] Proper camera/timing notation
- [ ] Total duration matches target

### D. CHARACTER CONTINUITY (Weight: 15%)
- [ ] Protagonist consistent across scenes
- [ ] Antagonist/supporting roles consistent
- [ ] Character descriptions locked
- [ ] No name/appearance drift

### E. PACING ALIGNMENT (Weight: 10%)
- [ ] Scene count appropriate for video length
- [ ] No section over/under-represented
- [ ] Transitions are logical

### F. REDUNDANCY CHECK (Weight: 10%)
- [ ] No duplicate concepts
- [ ] No unnecessary scene variations
- [ ] Efficient scene count

### G. PRODUCTION FEASIBILITY (Weight: 5%)
- [ ] Prompts achievable with target AI tool
- [ ] Complexity level appropriate
- [ ] No impossible visual requests

## OUTPUT FORMAT
1. **Overall Score**: X/100
2. **Pass/Fail Threshold**: 75/100 minimum
3. **Critical Issues**: [Blocking problems that must be fixed]
4. **Warnings**: [Non-blocking but should improve]
5. **Missing Elements**: [Script content not covered]
6. **Redundant Elements**: [Scenes to consolidate]
7. **Recommended Actions**: [Prioritized fix list]
```


***

## Specific Detection Questions

For your extension to auto-detect issues, include these specific checks:

**Gap Detection**

```
- Extract all H2/H3 headers from script → verify each has ≥1 scene
- Extract narrator V.O. lines → count unique concepts → compare to scene count
- Check for "Hook" scene in first position
- Check for "CTA" scene in final position
```

**Redundancy Detection**

```
- Group scenes by narrator V.O. text similarity (>70% = potential duplicate)
- Count scenes per script section (>3 per section = over-represented)
- Detect character name variations (Alex vs Alexander vs "protagonist")
```

**Technical Validation**

```
- Extract all frame rates → flag if >1 unique value
- Extract all style descriptions → flag if inconsistent
- Sum all [Xs-Ys] timing markers → compare to target duration
- Detect "[object Object]" or empty fields (data corruption)
```


***

## Implementation Suggestion

Build a **three-stage pipeline**:

1. **Automated Checks** → Technical consistency, character names, timing math, corruption detection
2. **AI Assessment** → Content coverage, visual storytelling quality, redundancy analysis using the master prompt
3. **Score Aggregation** → Weighted calculation + Pass/Fail decision + Action items

This mirrors how a real production house operates: technical QC first, creative review second, executive sign-off third.

Would you like me to help you build the Python functions for the automated checks portion?

