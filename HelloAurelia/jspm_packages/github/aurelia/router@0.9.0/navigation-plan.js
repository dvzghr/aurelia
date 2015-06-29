/* */ 
System.register(['./navigation-commands', './util'], function (_export) {
  'use strict';

  var Redirect, resolveUrl, activationStrategy, BuildNavigationPlanStep;

  _export('buildNavigationPlan', buildNavigationPlan);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function buildNavigationPlan(navigationContext, forceLifecycleMinimum) {
    var prev = navigationContext.prevInstruction;
    var next = navigationContext.nextInstruction;
    var plan = {},
        viewPortName;

    if ('redirect' in next.config) {
      var redirectLocation = resolveUrl(next.config.redirect, getInstructionBaseUrl(next));
      if (next.queryString) {
        redirectLocation += '?' + next.queryString;
      }

      return Promise.reject(new Redirect(redirectLocation));
    }

    if (prev) {
      var newParams = hasDifferentParameterValues(prev, next);
      var pending = [];

      for (viewPortName in prev.viewPortInstructions) {
        var prevViewPortInstruction = prev.viewPortInstructions[viewPortName];
        var nextViewPortConfig = next.config.viewPorts[viewPortName];
        var viewPortPlan = plan[viewPortName] = {
          name: viewPortName,
          config: nextViewPortConfig,
          prevComponent: prevViewPortInstruction.component,
          prevModuleId: prevViewPortInstruction.moduleId
        };

        if (prevViewPortInstruction.moduleId != nextViewPortConfig.moduleId) {
          viewPortPlan.strategy = activationStrategy.replace;
        } else if ('determineActivationStrategy' in prevViewPortInstruction.component.executionContext) {
          var _prevViewPortInstruction$component$executionContext;

          viewPortPlan.strategy = (_prevViewPortInstruction$component$executionContext = prevViewPortInstruction.component.executionContext).determineActivationStrategy.apply(_prevViewPortInstruction$component$executionContext, next.lifecycleArgs);
        } else if (newParams || forceLifecycleMinimum) {
          viewPortPlan.strategy = activationStrategy.invokeLifecycle;
        } else {
          viewPortPlan.strategy = activationStrategy.noChange;
        }

        if (viewPortPlan.strategy !== activationStrategy.replace && prevViewPortInstruction.childRouter) {
          var path = next.getWildcardPath();
          var task = prevViewPortInstruction.childRouter.createNavigationInstruction(path, next).then(function (childInstruction) {
            viewPortPlan.childNavigationContext = prevViewPortInstruction.childRouter.createNavigationContext(childInstruction);

            return buildNavigationPlan(viewPortPlan.childNavigationContext, viewPortPlan.strategy == activationStrategy.invokeLifecycle).then(function (childPlan) {
              viewPortPlan.childNavigationContext.plan = childPlan;
            });
          });

          pending.push(task);
        }
      }

      return Promise.all(pending).then(function () {
        return plan;
      });
    } else {
      for (viewPortName in next.config.viewPorts) {
        plan[viewPortName] = {
          name: viewPortName,
          strategy: activationStrategy.replace,
          config: next.config.viewPorts[viewPortName]
        };
      }

      return Promise.resolve(plan);
    }
  }

  function hasDifferentParameterValues(prev, next) {
    var prevParams = prev.params,
        nextParams = next.params,
        nextWildCardName = next.config.hasChildRouter ? next.getWildCardName() : null;

    for (var key in nextParams) {
      if (key === nextWildCardName) {
        continue;
      }

      if (prevParams[key] !== nextParams[key]) {
        return true;
      }
    }

    for (var key in prevParams) {
      if (key === nextWildCardName) {
        continue;
      }

      if (prevParams[key] !== nextParams[key]) {
        return true;
      }
    }

    return false;
  }

  function getInstructionBaseUrl(instruction) {
    var instructionBaseUrlParts = [];
    while (instruction = instruction.parentInstruction) {
      instructionBaseUrlParts.unshift(instruction.getBaseUrl());
    }

    instructionBaseUrlParts.unshift('/');
    return instructionBaseUrlParts.join('');
  }
  return {
    setters: [function (_navigationCommands) {
      Redirect = _navigationCommands.Redirect;
    }, function (_util) {
      resolveUrl = _util.resolveUrl;
    }],
    execute: function () {
      activationStrategy = {
        noChange: 'no-change',
        invokeLifecycle: 'invoke-lifecycle',
        replace: 'replace'
      };

      _export('activationStrategy', activationStrategy);

      BuildNavigationPlanStep = (function () {
        function BuildNavigationPlanStep() {
          _classCallCheck(this, BuildNavigationPlanStep);
        }

        BuildNavigationPlanStep.prototype.run = function run(navigationContext, next) {
          return buildNavigationPlan(navigationContext).then(function (plan) {
            navigationContext.plan = plan;
            return next();
          })['catch'](next.cancel);
        };

        return BuildNavigationPlanStep;
      })();

      _export('BuildNavigationPlanStep', BuildNavigationPlanStep);
    }
  };
});