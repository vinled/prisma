const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

const returnMatch = `  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden box-border flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">`;

const returnReplace = `  return (
    <>
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)}
        onUpgrade={() => {
          setIsPaywallOpen(false);
          setActiveTab('minha_conta');
        }}
      />
      <div className="w-full max-w-[100vw] overflow-x-hidden box-border flex flex-col md:flex-row min-h-screen md:h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200 text-gray-900 dark:text-gray-100">`;

code = code.replace(returnMatch, returnReplace);

code = code.replace(
  "        </div>\n      </aside>",
  "        </div>\n      </aside>\n    </>"
);

// We need to make sure we close the fragments at the very end of App component. 
// Instead of messing with the bottom of the file, let's just close the fragment manually.
const finalReturnMatch = `      </main>
    </div>
  );
}`;
const finalReturnReplace = `      </main>
    </div>
    </>
  );
}`;

code = code.replace(finalReturnMatch, finalReturnReplace);

fs.writeFileSync('src/App.tsx', code);
