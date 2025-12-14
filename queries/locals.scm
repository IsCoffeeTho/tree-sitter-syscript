(method) @local.scope
(for_loop) @local.scope
(while_loop) @local.scope

(parameter (identifier) @local.definition)

(let_declaration (identifier) @local.definition)
(const_declaration (identifier) @local.definition)

(singleton (reference (identifier) @local.reference))