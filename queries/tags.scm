
(method
	name: (identifier) @name) @definition.function
(classes
	name: (identifier) @name) @definition.class
(structs
	name: (identifier) @name) @definition.interface


(reference
	((identifier) @name
		(#is? function))) @reference.call
(constructor
	(identifier) @name) @reference.implementation