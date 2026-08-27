# Compound Engineering Setup: Action Items & Best Practices

> **Compound Engineering**: Every piece of work should be an investment. Codify how you work so AI does it better next time.[^1]

## Core Philosophy & Mindset Shifts

### 1. Think Like a Manager, Not an Operator
- [ ] Shift from "using tools" to "orchestrating agents"[^2]
- [ ] Treat AI agents like junior developers you manage, not tools you operate[^3]
- [ ] Build an orchestration layer that gives AI agents context, tools, and validation[^4]
- [ ] Adopt the "Explore → Plan → Execute" framework for every feature[^5]

### 2. Context is Everything
- [ ] Master the "LLM Empathy Test" - think like the AI you're prompting[^4]
- [ ] Always provide: mocks, linters, examples, and coding standards[^5]
- [ ] Use XML over Markdown for feeding context to LLMs (more structured)[^4]
- [ ] Remember: AI prefers writing new code vs editing existing code[^5]

### 3. Pattern Capture Over Automation
- [ ] Record code review sessions with colleagues[^3]
- [ ] Transcribe recordings and extract coding patterns into slash commands[^3]
- [ ] Create natural-language rules instead of brittle workflows[^1]
- [ ] Turn every code review into a reusable system[^1]

## Essential Tools & Setup

### Claude Code Configuration

#### CLAUDE.md Files
- [ ] Create a root `claude.md` file with project core context[^5]
- [ ] Add `claude.md` files in every subfolder for specific contexts[^5]
- [ ] Include: project structure, coding standards, preferred libraries, architectural decisions
- [ ] Reference Anthropic's best practices: https://www.anthropic.com/engineering/claude-code-best-practices

#### Custom Slash Commands
- [ ] Create reusable slash commands to eliminate repetitive work[^2]
- [ ] Example commands: `/security-review`, `/design-review`, `/test-coverage`
- [ ] Share slash commands across your team[^4]
- [ ] Browse community commands: https://claudecodecommands.directory/

#### Subagents (Specialized AI Reviewers)
- [ ] Create a "Design Reviewer" subagent for UI feedback[^6]
- [ ] Create a "Security Reviewer" subagent for code audits[^7]
- [ ] Create specialized subagents for: architecture, testing, accessibility, performance
- [ ] Package subagents for team-wide use[^6]
- [ ] Use Anthropic Console Prompt Generator to scaffold robust agents[^1]

### GitHub Integration

#### Basic Setup
- [ ] Enable Claude Code GitHub integration for automated AI teammate[^5]
- [ ] Configure GitHub CLI for seamless PR workflows[^3]
- [ ] Set up GitHub issues for AI-generated feature planning[^1]

#### Advanced GitHub Actions (Outer Loop)
- [ ] Implement automated PR reviews with GitHub Actions[^7]
- [ ] Set up security review actions on every PR[^7]
- [ ] Configure multi-agent code review workflows[^2]
- [ ] Modify YAML files to customize review depth[^5]
- [ ] Reference: https://github.com/anthropics/claude-code-action

### Development Environment

#### Git Workflows
- [ ] Master git worktrees for running multiple AI agents in parallel[^3]
- [ ] Set up separate terminals for each agent (treat as team members)[^3]
- [ ] Use parallel development with git worktrees[^6]
- [ ] Never use `/compact` - it destroys high-quality context[^5]
- [ ] Use `/rewind` instead to preserve context[^5]

#### Essential Keyboard Shortcuts
- [ ] Master double-escape (esc esc) to fork conversations[^5]
- [ ] Use `/resume` to create multiple high-context agents[^5]
- [ ] Learn when to use Claude Code vs Cursor (agentic vs editing)[^5]

### Voice & Rapid Prototyping
- [ ] Set up SuperWhisper for voice-to-code/text[^4]
- [ ] Use Monologue for voice UI descriptions & mockup generation[^1]
- [ ] Practice describing UIs verbally and iterating in seconds[^1]

### Browser Automation & Visual AI

#### Playwright MCP Setup
- [ ] Install and configure Playwright MCP[^6]
- [ ] Enable Claude Code to control browser and take screenshots[^6]
- [ ] Create iterative agentic loops for design self-correction[^6]
- [ ] Build custom design review workflows with visual feedback[^6]

### Model Context Protocol (MCPs)
- [ ] Understand MCPs as the future of packaging tools for LLMs[^4]
- [ ] Install Context7 MCP for enhanced context[^3]
- [ ] Explore and install relevant MCPs for your stack[^4]
- [ ] Learn to create custom MCPs for team-specific needs[^4]

## Workflow Implementation

### The Four-Step Compound Engineering Workflow[^8]

#### 1. Plan Phase
- [ ] Start with voice description of feature requirements[^8]
- [ ] Use Claude to generate mockups from screenshots + voice[^1]
- [ ] Create GitHub issues with AI research on best approaches[^1]
- [ ] Run multi-agent planning: repo research, best-practices scout, framework researcher[^1]
- [ ] Force Claude to build deep context before coding[^5]

#### 2. Delegate Phase
- [ ] Assign features to separate AI agents using git worktrees[^3]
- [ ] Give each agent specific context and constraints[^1]
- [ ] Use multiple Claude Code instances in parallel[^2]
- [ ] Apply human judgment to simplify when AI over-engineers[^1]

#### 3. Assess Phase (Inner Loop Review)
- [ ] Run automated code reviews with subagents[^2]
- [ ] Use `/security-review` command before committing[^7]
- [ ] Review AI-generated code (this becomes the bottleneck, not writing)[^3]
- [ ] Implement tiered review checklists based on risk level[^3]

#### 4. Qualify Phase (Outer Loop Review)
- [ ] Create agentic PRs with automated test flows[^1]
- [ ] Run GitHub Actions for sub-agent code reviews[^7]
- [ ] Use multi-perspective review bots[^2]
- [ ] Capture feedback patterns for next iteration[^8]

### Advanced Techniques

#### Research-First Development
- [ ] Always start with dedicated research phase[^3]
- [ ] Have AI gather context and explore multiple approaches[^3]
- [ ] Create detailed GitHub issues before writing code[^3]
- [ ] Prevents AI from going off the rails during implementation[^3]

#### The "My Developer" Prompt Trick
- [ ] Use this prompt to get unbiased feedback: "Act as my developer reviewing this code"[^5]
- [ ] Gets Claude to critique its own work honestly[^5]
- [ ] Reveals issues you might miss in direct implementation[^5]

#### Context Window Management
- [ ] Avoid `/compact` at all costs - destroys valuable context[^5]
- [ ] Use `/rewind` to preserve high-quality context while going back[^5]
- [ ] Use double-escape to fork conversations at decision points[^5]
- [ ] Keep context rich with examples, not summaries[^5]

#### Force Breaking Changes When Appropriate
- [ ] Explicitly tell Claude to ignore backwards compatibility for cleaner refactors[^5]
- [ ] Don't let legacy constraints prevent better architecture[^5]
- [ ] AI often defaults to "safe" changes - override when needed[^5]

## Operational Excellence

### Team Enablement

#### Onboarding & Knowledge Sharing
- [ ] Document workflows in shared team wiki[^4]
- [ ] Create onboarding guides for non-technical team members[^4]
- [ ] Share prompts and commands across organization[^4]
- [ ] Record sessions and extract SOPs[^8]
- [ ] Host internal demos of compound engineering workflows[^8]

#### Bridging Technical & Non-Technical Gaps
- [ ] Use AI to eliminate meeting bottlenecks[^4]
- [ ] Enable non-technical people to prototype features[^9]
- [ ] Replace endless docs with AI-generated specs[^4]
- [ ] Empower entire organization to build more of the stack[^4]

### Quality & Governance

#### Validation & Evals
- [ ] Implement evals for critical AI outputs[^4]
- [ ] Understand model "personalities" and strengths[^4]
- [ ] Test different models for different tasks[^1]
- [ ] Create validation layers in orchestration system[^4]

#### Security & Privacy
- [ ] Run security reviews on all AI-generated code[^7]
- [ ] Implement tiered security checks (payments, migrations, etc.)[^3]
- [ ] Establish governance for AI-driven development[^4]
- [ ] Use encryption only when complexity is justified[^1]

### Continuous Improvement
- [ ] Extract learnings from every sprint into new commands[^8]
- [ ] Refine subagents based on review patterns[^8]
- [ ] Update claude.md files as patterns emerge[^8]
- [ ] Build a library of reusable workflows[^8]

## Practical Examples & Case Studies

### Real-World Wins
- Built ChatPRD (AI Product Manager) over Thanksgiving weekend as a side hustle - now 10,000+ users, six figures revenue[^9]
- Built high-performance WebGL app with AI[^4]
- Built full SaaS dashboard in 5 hours[^4]
- Cora email app built almost entirely solo with AI agents - 2,500+ users including Anthropic executives[^8]
- Swift app vibe-coded in one evening[^3]

### Learning Resources
- [ ] Study Anthropic's open-source repos:
  - https://github.com/anthropics/claude-code-action
  - https://github.com/anthropics/claude-code-security-review
- [ ] Review agent examples: https://github.com/wshobson/agents
- [ ] Take DeepLearning.AI course: "A Highly Agentic Coding Assistant"[^8]
- [ ] Read: Every.to articles on Compound Engineering[^1]

## Tools Quick Reference

### Core Development Stack
- **Claude Code** - Primary agentic coding assistant
- **Cursor** - For hands-on editing vs agentic work
- **Friday AI** - Alternative agentic tool with "YOLO mode"
- **VS Code** - IDE setup for manual edits when needed

### Context & Communication
- **SuperWhisper** - Voice-to-text for specs
- **Monologue** - Voice UI descriptions & mockup generation
- **Granola** - Meeting notes & context capture
- **Deep Research** - AI research assistant

### Automation & Integration
- **n8n, Zapier, Gumloop** - Workflow automation
- **GitHub CLI** - PR and issue automation
- **Warp Terminal** - Modern terminal for managing multiple agents

### Browser & Testing
- **Playwright MCP** - Browser automation with vision
- **Firecrawl** - Web scraping for context

### Specialized Tools
- **Context7 MCP** - Enhanced context protocol
- **Anthropic Console Prompt Generator** - Scaffold robust prompts
- **Charlie AI** - PR review bot
- **Clerk.dev** - Authentication (used in ChatPRD)
- **Tiptap** - Rich text editor (used in ChatPRD)
- **Braintrust** - AI validation & evals

## Key Mental Models

### The Orchestration Mindset
> "Think like an environment builder, not a tool user."[^4]

Instead of asking "How do I prompt AI to do X?", ask "What environment, context, and tools does the AI need to successfully complete X?"

### The Compound Effect
> "Every piece of work should compound. If you're doing it twice, you're doing it wrong."[^1]

Extract reusable systems from every interaction. The goal isn't just to complete tasks, but to make future tasks easier.

### The Manager Paradigm
> "I'm like a manager with an AI agent team."[^2]

You're coordinating multiple specialized agents, each with their own strengths, working in parallel on different aspects of the system.

### No Excuse Not to Prototype
> "There's no excuse not to have a prototype anymore."[^1]

The barrier to building is near zero. Ideas can become functional prototypes in hours, not months.

## Next Steps: Getting Started Today

1. **Week 1: Foundation**
   - Set up Claude Code with GitHub integration
   - Create your first claude.md file
   - Install SuperWhisper for voice input
   - Try the "Explore → Plan → Execute" framework on one feature

2. **Week 2: Workflows**
   - Set up git worktrees
   - Create your first custom slash command
   - Record a code review and extract patterns
   - Build your first subagent

3. **Week 3: Automation**
   - Implement GitHub Actions for PR reviews
   - Set up Playwright MCP for UI work
   - Create tiered review checklists
   - Document your workflow for team

4. **Week 4: Scale**
   - Onboard first team member to your workflow
   - Build library of reusable commands
   - Start weekly compound engineering sessions
   - Measure velocity improvements

---

## Footnotes

[^1]: [Compound Engineering: Manage Teams of AI Agents](https://www.youtube.com/watch?v=srh0zy1MQcI&list=WL&index=6)
[^2]: [Full Tutorial: Build with Multiple AI Agents using Claude Code](https://www.youtube.com/watch?v=Z_iWe6dyGzs&list=WL&index=9)
[^3]: [Building Solo: How One Engineer Uses AI Agents to Ship Production Code](https://www.youtube.com/watch?v=VEQDReyND0s&list=WL&index=8)
[^4]: [My Startup's AI Agent Playbook for 5-10x Engineering Speed](https://www.youtube.com/watch?v=_PxkYZ_4z50&list=WL&index=2)
[^5]: [Master Claude Code: Proven Daily Workflows from 3 Technical Founders](https://www.youtube.com/watch?v=hOqgFNlbrYE&list=WL&index=4)
[^6]: [Turn Claude Code into Your Own INCREDIBLE UI Designer](https://www.youtube.com/watch?v=xOO8Wt_i72s&list=WL&index=3)
[^7]: [Anthropic's NEW Claude Code Review Agent](https://www.youtube.com/watch?v=nItsfXwujjg&list=WL&index=1)
[^8]: [How I Use Claude Code to Ship Like a Team of 5](https://www.youtube.com/watch?v=8IOeygZRIY8&list=WL&index=7)
[^9]: [She Built an AI Product Manager Bringing in Six Figures](https://www.youtube.com/watch?v=jnZoJoG2y6c&list=WL&index=5)
