with open('src/App.tsx', 'r') as f:
    content = f.read()

target = """                </div>
              )}
            </section>
          </div>

          {/* Preview Side */}"""

replacement = """                </div>
              )}
            </section>

            {/* Mobile Form Actions */}
            <div className="flex lg:hidden gap-4 mt-8 pb-8">
              <button
                onClick={() => {
                  setActiveTab('meus_imoveis');
                  setIdEmEdicao(null);
                }}
                className="flex-1 py-3 text-gray-600 border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800 font-medium rounded-xl transition-colors"
              >
                Voltar
              </button>
              {idEmEdicao && (
                <button
                  onClick={handleSaveOnly}
                  disabled={isExporting}
                  className="flex-1 py-3 bg-emerald-600 text-white hover:bg-emerald-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  Salvar
                </button>
              )}
            </div>
          </div>

          {/* Preview Side */}"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/App.tsx', 'w') as f:
        f.write(content)
    print("Patched form actions successfully.")
else:
    print("Target not found.")
