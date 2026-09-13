const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const dataDir = path.join(__dirname, '..', 'data', 'bioclash');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.yaml'));

if (!files.length) {
  console.log('No YAML files found in', dataDir);
  process.exit(0);
}

let totalErrors = 0;

files.forEach(function (file) {
  const filePath = path.join(dataDir, file);
  const paper = yaml.load(fs.readFileSync(filePath, 'utf8'));
  const errors = [];

  if (!paper.id) errors.push('Missing paper id');
  if (!paper.title) errors.push('Missing paper title');
  if (paper.durationMinutes == null) errors.push('Missing durationMinutes');
  if (paper.totalMarks == null) errors.push('Missing totalMarks');

  const allBlocks = [];
  const blockIds = new Set();
  const partIds = new Set();

  (paper.parts || []).forEach(function (part) {
    if (!part.id) {
      errors.push('Part missing id');
      return;
    }
    if (partIds.has(part.id)) errors.push('Duplicate part id: ' + part.id);
    partIds.add(part.id);

    (part.blocks || []).forEach(function (block) {
      if (!block.id) {
        errors.push('Block missing id in part ' + part.id);
        return;
      }
      if (blockIds.has(block.id)) errors.push('Duplicate block id: ' + block.id);
      blockIds.add(block.id);
      allBlocks.push({ ...block, partId: part.id });
    });
  });

  allBlocks.forEach(function (block) {
    var reveals = block.reveals;
    if (reveals) {
      var targets = Array.isArray(reveals) ? reveals : [reveals];
      targets.forEach(function (t) {
        if (!blockIds.has(t)) errors.push('Block ' + block.id + ' reveals unknown block: ' + t);
      });
    }
    var revealsParts = block.revealsParts;
    if (revealsParts) {
      var pts = Array.isArray(revealsParts) ? revealsParts : [revealsParts];
      pts.forEach(function (p) {
        if (!partIds.has(p)) errors.push('Block ' + block.id + ' revealsParts unknown part: ' + p);
      });
    }
  });

  function detectCycle() {
    var adj = {};
    allBlocks.forEach(function (block) {
      adj[block.id] = [];
      var reveals = block.reveals;
      if (reveals) {
        var targets = Array.isArray(reveals) ? reveals : [reveals];
        targets.forEach(function (t) { if (blockIds.has(t)) adj[block.id].push(t); });
      }
    });
    var visited = {};
    var stack = {};
    function dfs(nodeId) {
      visited[nodeId] = true;
      stack[nodeId] = true;
      var neighbors = adj[nodeId] || [];
      for (var i = 0; i < neighbors.length; i++) {
        if (stack[neighbors[i]]) return 'Cycle detected involving block: ' + neighbors[i];
        if (!visited[neighbors[i]]) {
          var result = dfs(neighbors[i]);
          if (result) return result;
        }
      }
      stack[nodeId] = false;
      return null;
    }
    for (var id in adj) {
      if (!visited[id]) {
        var cycleResult = dfs(id);
        if (cycleResult) return cycleResult;
      }
    }
    return null;
  }
  var cycleError = detectCycle();
  if (cycleError) errors.push(cycleError);

  var computedMarks = 0;
  allBlocks.forEach(function (block) {
    if (block.type === 'reveal_content') return;
    (block.components || []).forEach(function (c) {
      if (c.marks) computedMarks += c.marks;
      if (c.marksEach) {
        var optionCount = 0;
        if (c.refersTo) {
          allBlocks.forEach(function (b) {
            (b.components || []).forEach(function (comp) {
              if (comp.key === c.refersTo && comp.options) {
                optionCount = comp.options.length - 1;
              }
            });
          });
        }
        if (optionCount > 0) computedMarks += c.marksEach * optionCount;
      }
    });
  });
  if (paper.totalMarks != null && computedMarks !== paper.totalMarks) {
    errors.push('Marks mismatch: components sum to ' + computedMarks + ', paper declares totalMarks=' + paper.totalMarks);
  }

  allBlocks.forEach(function (block) {
    if (block.type === 'reveal_content') return;
    (block.components || []).forEach(function (c) {
      if (!c.key) {
        errors.push('Component missing key in block ' + block.id);
        return;
      }
      if (!c.type) {
        errors.push('Component ' + c.key + ' missing type in block ' + block.id);
        return;
      }
      if (c.type === 'mcq') {
        if (!c.options || !c.options.length) {
          errors.push('MCQ ' + c.key + ' in block ' + block.id + ' has no options');
        }
        if (c.correctKey !== undefined) {
          var optionKeys = (c.options || []).map(function (o) { return o.key; });
          if (optionKeys.indexOf(c.correctKey) === -1) {
            errors.push('MCQ ' + c.key + ' in block ' + block.id + ': correctKey "' + c.correctKey + '" not in options [' + optionKeys.join(', ') + ']');
          }
        }
      }
      if (c.type === 'true_false' && c.correctValue !== undefined) {
        if (typeof c.correctValue !== 'boolean') {
          errors.push('true_false ' + c.key + ' in block ' + block.id + ': correctValue should be boolean, got ' + typeof c.correctValue);
        }
      }
      if (c.type === 'numeric') {
        if (c.expected === undefined) {
          errors.push('Numeric ' + c.key + ' in block ' + block.id + ' missing expected value');
        }
      }
      if (c.type === 'free_text_for_others') {
        if (!c.refersTo) {
          errors.push('free_text_for_others ' + c.key + ' in block ' + block.id + ' missing refersTo');
        } else {
          var found = false;
          allBlocks.forEach(function (b) {
            (b.components || []).forEach(function (comp) {
              if (comp.key === c.refersTo) found = true;
            });
          });
          if (!found) {
            errors.push('free_text_for_others ' + c.key + ' in block ' + block.id + ': refersTo "' + c.refersTo + '" not found');
          }
        }
      }
    });
  });

  console.log('\n=== ' + file + ' (' + paper.id + ') ===');
  console.log('Parts: ' + (paper.parts || []).length + ', Blocks: ' + allBlocks.length + ', Declared marks: ' + paper.totalMarks);
  if (errors.length === 0) {
    console.log('OK: No validation errors.');
  } else {
    errors.forEach(function (e) { console.log('  ERROR: ' + e); });
    totalErrors += errors.length;
  }
});

console.log('\n' + (totalErrors === 0 ? 'All papers valid.' : totalErrors + ' error(s) found.'));
process.exit(totalErrors > 0 ? 1 : 0);
