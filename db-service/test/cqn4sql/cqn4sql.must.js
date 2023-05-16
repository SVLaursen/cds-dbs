'use strict'

// SMW Adding table aliases?
// If cqn contains no association paths, we do not add any joins or subqueries
// -> cqn must already contain all necessary aliases
// -> we SHOULD not add aliases
// but: this is a SHOULD, for the beginning we can - if this is simpler - always add an alias

// Terminology:
//   definition of explicit table alias
//                           v----------v
//     select from what.ever as explAlias ...
//
//   usage of table alias
//                             v--v
//     select from what.ever { ever.field }
//
// Rules:
// in the result query, ...
// * we always generate explicit table alias definitions into the FROM clause(s)
//   we can optimze later: remove explicit alias definition if
//     (a) it is not used or
//     (b) it is equal to the "implicit" table alias that will be effective in the resulting SQL (!) statement
// * we always use table aliases for fields in the select list, WHERE, GROUP BY, HAVING
//   we can optimize later: only use table alias if they were already in the original query, or if they are
//   necessary due to joins/subqueries generated by us
// * ORDER BY has special rules, see below

// add SHOULD
//  > {SELECT:{from:{},count:true,search:[{val:'Wu'}]}}
//  { SELECT: { from: {}, count: true, search: [{val:'Wu'}] } }
// -> add respective where clauses for all text fields (incl. in composition children)
// implementation already exists in runtime

// > CQL`SELECT from Authors { ID, name, (SELECT author_ID, title from Books where exists (SELECT 1 as one from Authors where name like 'Edgar%' and ID = Books.author_ID )) as books } where name like 'Edgar%'`

// add SHOULD
//  where count(assoc) > 222

// for flattened OData: cqn with struc.elem would not work, as already flattened
//   -> struc cannot be resolved
//   -> could we have primitive translation -> struc_elem
