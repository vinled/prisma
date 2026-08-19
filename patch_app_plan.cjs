const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// For now, hardcode userPlan as 'free', or we could make it a state.
// Since the prompt asks to verify the plan state, let's create a dummy state for userPlan.
const stateMatch = "const [applyBrandKit, setApplyBrandKit] = useState(true);";
const stateReplace = "const [applyBrandKit, setApplyBrandKit] = useState(true);\n  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');";

code = code.replace(stateMatch, stateReplace);

// Inject into TemplateRenderers
const renderMatch1 = `<TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}
                      options={templateOptions}
                    />`;

const renderReplace1 = `<TemplateRenderer 
                      templateId={selectedTemplate} 
                      details={details} 
                      image={images[previewIndex] || null} 
                      logo={applyBrandKit ? (brandKit?.logo || null) : null}
                      aspectRatio={aspectRatio}
                      brandKit={applyBrandKit ? brandKit : undefined}
                      options={templateOptions}
                      userPlan={userPlan}
                    />`;

code = code.replace(renderMatch1, renderReplace1);

const renderMatch2 = `<TemplateRenderer 
              templateId={selectedTemplate} 
              details={details} 
              image={img} 
              logo={applyBrandKit ? (brandKit?.logo || null) : null}
              aspectRatio={aspectRatio}
              brandKit={applyBrandKit ? brandKit : undefined}
              options={templateOptions}
            />`;

const renderReplace2 = `<TemplateRenderer 
              templateId={selectedTemplate} 
              details={details} 
              image={img} 
              logo={applyBrandKit ? (brandKit?.logo || null) : null}
              aspectRatio={aspectRatio}
              brandKit={applyBrandKit ? brandKit : undefined}
              options={templateOptions}
              userPlan={userPlan}
            />`;

code = code.replace(renderMatch2, renderReplace2);

fs.writeFileSync('src/App.tsx', code);
