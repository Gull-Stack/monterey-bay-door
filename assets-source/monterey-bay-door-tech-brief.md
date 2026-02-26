# MONTEREY BAY DOOR - Technical Build Brief for Melvin

## PROJECT OVERVIEW
**Client:** Tommy - Monterey Bay Door
**Domain:** mbdoor.com (needs DNS coordination with Livewire IT)
**Timeline:** Speed launch this week, Tommy returns from Costa Rica next week
**Revenue Model:** Monthly ($500/month) or Hybrid ($2500 + $100/month)

## SITE ARCHITECTURE

### Required Pages (Phase 1)
```
📁 monterey-bay-door/
├── 🏠 Homepage (/)
├── 📋 About (/about/)
├── 🔧 Services
│   ├── Access Control Systems (/access-control/)
│   ├── Commercial Door Hardware (/commercial-hardware/) 
│   └── Maintenance & Service (/maintenance/)
├── 🏢 Projects (/projects/)
├── 🤝 Vendor Partners (/partners/)
├── 📍 Service Areas (/service-areas/)
└── 📞 Contact (/contact/)
```

### Technical Stack
- **Framework:** 11ty (GullStack standard)
- **Hosting:** Vercel
- **Repo:** GitHub (Gull-Stack org)
- **CSS:** Responsive, professional commercial look
- **Forms:** Netlify Forms or similar for lead gen

## DESIGN REQUIREMENTS

### Visual Framework  
**Design Template:** Use dwellpaint.com structure/layout as framework
**Adaptation:** Commercial door hardware focus vs. paint products
**Tone:** Clean, professional, trustworthy (like Dwell but B2B)
**Colors:** Professional blues/grays + Tommy's logo colors
**Typography:** Clean, readable, business-appropriate (Dwell-style)

### Key Visual Elements
- **Hero Image:** Commercial building or access control system
- **Project Gallery:** Before/after, installation photos (Tommy providing)
- **Vendor Logos:** Allegion + others (authority building)
- **Service Icons:** Access control, door hardware, maintenance

### Mobile-First Design
- **Lead Gen Forms:** Easy mobile completion
- **Click-to-Call:** Phone numbers as clickable links
- **Project Gallery:** Mobile-optimized image viewing
- **Local Info:** Easy access to service area/location

## CONTENT INTEGRATION

### Copy Sources
- **Content Brief:** `/monterey-bay-door-content-brief.md` (all copy requirements)
- **Research:** `/monterey-bay-door-research.md` (keywords, competitors)
- **Client Assets:** Tommy sending logos + project photos

### SEO Implementation
**Primary Keywords per Page:**
- Homepage: "access control systems monterey bay"
- Access Control: "access control installation monterey bay"  
- Hardware: "commercial door hardware supplier california"
- Service Areas: "access control [city] california"

**Technical SEO:**
- Schema markup for LocalBusiness
- OpenGraph tags for social sharing
- Sitemap generation
- Google Analytics setup

## FUNCTIONAL REQUIREMENTS

### Lead Generation
**Primary CTA:** "Request Commercial Quote"
- Form fields: Name, Company, Phone, Email, Project Type, Message
- Redirect: Thank you page with next steps
- Email notification: To Tommy + backup email

**Secondary CTAs:**
- "Call Now" buttons with tel: links  
- "Download Guide" (future lead magnet)
- "View Projects" → Project gallery

### Contact Information
**Display Consistently:**
- **Phone:** [Tommy to provide]
- **Email:** [Tommy to provide] 
- **Address:** Hollister, CA location
- **Service Area:** Monterey Bay to Central Coast

### Google My Business Integration
- **NAP Consistency:** Name, Address, Phone identical across site
- **Schema Markup:** LocalBusiness structured data
- **Service Areas:** Geographic coverage mapping
- **Categories:** Access Control Supplier, Commercial Locksmith

## INTEGRATION REQUIREMENTS

### Analytics & Tracking
- **Google Analytics 4:** Track lead generation, page views
- **Google Tag Manager:** For conversion tracking
- **Call Tracking:** Phone number conversion attribution
- **Form Analytics:** Lead source attribution

### Third-Party Integrations (Future)
- **CRM Integration:** For lead management (TBD)
- **Payment Processing:** For e-commerce phase (future)
- **Scheduling Tool:** For consultations (future)

## CONTENT MANAGEMENT

### Admin Access
- **Tommy:** Content editing access
- **Bryce:** Full admin access
- **Future:** Train Tommy on basic content updates

### Content Updates
- **Project Photos:** Easy upload/management system
- **Vendor Logos:** Simple addition/removal process
- **Service Pages:** Editable without developer

## PERFORMANCE REQUIREMENTS

### Speed Targets
- **Mobile:** < 3 second load time
- **Desktop:** < 2 second load time  
- **Core Web Vitals:** Pass all metrics
- **Image Optimization:** Automatic resizing/compression

### SEO Technical
- **Lighthouse Score:** 90+ on all pages
- **Mobile Friendly:** Google Mobile-Friendly Test pass
- **SSL Certificate:** HTTPS enabled
- **Crawlability:** robots.txt, sitemap.xml

## LAUNCH CHECKLIST

### Pre-Launch
- [ ] DNS coordination with Livewire IT
- [ ] SSL certificate installation
- [ ] Google Analytics setup
- [ ] Google Search Console setup
- [ ] Form testing (lead notifications)
- [ ] Mobile responsiveness testing

### Launch Day
- [ ] DNS cutover coordination
- [ ] Google My Business setup/optimization
- [ ] Social media profile updates (if applicable)
- [ ] Client notification/training

### Post-Launch (Week 1)
- [ ] Google Analytics verification
- [ ] Search Console indexing request  
- [ ] Performance monitoring
- [ ] Lead generation testing
- [ ] Client feedback collection

## PHASE 2 PLANNING (E-Commerce)

### Future Enhancements
**E-Commerce Features:**
- Product catalog integration
- Quote request system
- Customer portal
- Inventory management

**Advanced Functionality:**
- Door hardware configurator
- Specification downloads
- Dealer portal access
- Service scheduling system

## CLIENT COMMUNICATION

### Asset Collection
**Needed from Tommy:**
- [ ] Logo files (multiple formats)
- [ ] Project photos (high resolution)
- [ ] Vendor partner logos (with permission)
- [ ] Contact information (phone, email, address)
- [ ] Any existing brand guidelines

### Approval Process
- **Design Mockups:** Send for approval before development
- **Content Review:** Confirm copy accuracy with Tommy
- **Testing Phase:** Client walkthrough before launch
- **Training:** Basic content management training

## TECHNICAL NOTES

### Domain Management
- **Current Status:** mbdoor.com showing Cloudflare error
- **DNS Provider:** Cloudflare (via Livewire IT)
- **Coordination:** Connect with Tommy's IT guy for nameserver setup

### GullStack Standards
- **Footer:** Include GullStack branding/link
- **Workflow:** Staging → Production deployment
- **Repository:** Add to Gull-Stack GitHub organization
- **Monitoring:** Standard GullStack monitoring setup

---
**Ready to Build:** All requirements documented, client assets pending, timeline confirmed