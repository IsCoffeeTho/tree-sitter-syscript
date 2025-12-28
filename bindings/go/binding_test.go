package tree_sitter_syscript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_syscript "github.com/tree-sitter/tree-sitter-syscript/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_syscript.Language())
	if language == nil {
		t.Errorf("Error loading Syscript grammar")
	}
}
