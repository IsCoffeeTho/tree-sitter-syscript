(method) @local.scope
(for_loop) @local.scope
(while) @local.scope

(parameter (identifier) @local.definition)

(let_declaration (identifier) @local.definition)
(const_declaration (identifier) @local.definition)

(value (reference (identifier) @local.reference))