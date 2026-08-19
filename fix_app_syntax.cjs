const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// The incorrect fragment end logic:
code = code.replace(
  "        </div>\n      </aside>\n    </>",
  "        </div>\n      </aside>"
);

// Close fragment at the very end. The end of the file is currently:
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// Wait, the previous finalReturnMatch was replacing </main>.
// Let's just fix it manually using a regex.
code = code.replace(/    <\/div>\n  \);\n}\n?$/, "    </div>\n    </>\n  );\n}\n");

fs.writeFileSync('src/App.tsx', code);
