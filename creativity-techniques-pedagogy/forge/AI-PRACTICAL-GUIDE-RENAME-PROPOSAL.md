# Proposal: Restructure AI Documentation into Three Pillars

## Current State

The document at https://ruvebal.github.io/web-atelier-udit/methodology/en/ai-practical-guide/ currently mixes practical development steps with ethical and legal considerations, making it difficult to maintain clear boundaries between different aspects of AI usage.

## Proposed Restructuring

### Pillar 1: AI-Assisted Development Protocol (Technical Focus)

**New Title**: "AI-Assisted Development Protocol"

**Purpose**: Technical workflow and verification steps for developers using AI tools.

**Scope**:

- Development workflow steps (plan → execute → verify → document)
- Technical verification checklist
- Architecture and security considerations
- Integration with development lifecycle
- MCP/server verification protocols
- Documentation standards for AI-assisted code

**Keep from current guide**:

- Docs-first loop
- README disclosure requirements
- Verification checklist
- Technical security considerations
- The ladder (Classical → Hybrid → AI-augmented → Governance)

**Remove from this document**:

- Broader ethical frameworks
- Regulatory compliance details
- Funding and research context
- Human Flourishing Test (move to ethical position)

### Pillar 2: AI Ethical Position (Strategic Focus)

**New Document**: "AI Ethical Position and Research Context"

**Purpose**: Comprehensive ethical framework grounded in funded research and institutional values.

**Scope**:

- Human-centered AI principles
- Research funding context (MSCA, institutional grants)
- Computational authorship research alignment
- Ethical frameworks from funded projects
- Value alignment with institutional mission
- Pedagogical philosophy for AI in education
- Human Flourishing Test and ethical decision-making

**Content sources**:

- MSCA computational authorship project findings
- Institutional AI ethics statements
- Research grant outcomes and principles
- Educational philosophy and pedagogy
- UNESCO and international frameworks
- Authorship and transparency research

**Structure**:

- Research foundation and funding context
- Core ethical principles
- Decision-making frameworks
- Pedagogical applications
- Institutional alignment
- Future research directions

### Pillar 3: AI Legal and Regulatory Framework (Compliance Focus)

**New Document**: "AI Legal and Regulatory Compliance"

**Purpose**: Clear guidance on legal requirements and regulatory compliance for AI usage.

**Scope**:

- EU AI Act 2024 requirements
- Copyright and intellectual property considerations
- Data protection and privacy (GDPR)
- Institutional policy compliance
- Industry-specific regulations
- Liability and accountability frameworks
- International regulatory landscape

**Content sources**:

- EU AI Act 2024 text and guidance
- Institutional legal counsel guidance
- Industry best practices
- Legal precedents and case law
- Regulatory agency guidelines

## Implementation Strategy

### Phase 1: Content Separation

1. Extract technical workflow content from current guide → Development Protocol
2. Extract ethical frameworks and research context → Ethical Position
3. Extract legal/regulatory content → Legal Framework
4. Create cross-reference structure between documents

### Phase 2: Enhancement

1. **Development Protocol**: Focus on actionable steps, checklists, and technical verification
2. **Ethical Position**: Incorporate all funded research context, grant outcomes, and institutional values
3. **Legal Framework**: Ensure comprehensive coverage of current regulations with update mechanisms

### Phase 3: Integration

1. Update navigation across web-atelier-udit curriculum
2. Create clear entry points for different audiences:
   - Students: Start with Development Protocol
   - Researchers: Start with Ethical Position
   - Administrators: Start with Legal Framework
3. Establish maintenance schedules for each document type

## Benefits of This Structure

### Clarity and Focus

- Each document serves a distinct purpose and audience
- Technical practitioners get actionable steps without ethical digressions
- Researchers get comprehensive ethical context without technical details
- Administrators get clear compliance guidance

### Maintenance

- Technical protocols can update with tool changes without touching ethics
- Legal framework can update with regulations without affecting workflows
- Ethical position can evolve with research without impacting technical steps

### Scalability

- Easy to add new technical protocols as tools evolve
- Can expand legal coverage as new regulations emerge
- Ethical position can grow with new research findings

## Cross-Reference Structure

- Development Protocol links to Ethical Position for "why"
- Ethical Position links to Legal Framework for "requirements"
- Legal Framework links to Development Protocol for "implementation"
- All three link to AI-Assisted Development Foundations for technical depth

## File Structure Proposal

```
/methodology/en/
├── ai-assisted-development-protocol/     # Technical focus
├── ai-ethical-position/                  # Strategic focus (new)
└── ai-legal-regulatory-framework/        # Compliance focus (new)
```
