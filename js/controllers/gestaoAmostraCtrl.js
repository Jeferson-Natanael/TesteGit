var app = angular.module('GestaoAmostra', []);
var caminhoAPI  = "172.28.2.56:13550";
// var caminhoAPI  = "psvserver02/LIMS.WebAPI";
app.controller('GestaoAmostraCtrl', function ($scope, $rootScope, $mdDialog, $http, $window, NgTableParams) {
    $rootScope.title = 'Gestão da Amostra';
    $rootScope.btnOption = true;
    $rootScope.lstItensOperacoes = [
        {
            name: 'Processos', display: 'Processos', icon: 'img/icons/processos.svg',
            subMenu: [
                        { name: 'ReceberAmostra', display: 'Receber Amostra', icon: "img/icons/receber_amostra.svg" },
                        { name: 'Inspecionar', display: 'Inspecionar', icon: "img/icons/inspecionar_amostra.svg" },
                        { name: 'Preparacao', display: 'Preparacão', icon: "img/icons/preparacao.svg" },
                        { name: 'Prioridade', display: 'Prioridade', icon: "img/icons/prioridade.svg" },
                        { name: 'MoverAmostra', display: 'Mover Amostra', icon: "img/icons/mover_amostra.svg" },
                        { name: 'Revisao', display: 'Revisão', icon: "img/icons/revisao_amostra.svg" },
                        { name: 'CompletarAmostra', display: 'Completar Amostra', icon: "img/icons/completar_amostra.svg" },
                        { name: 'Autorizar', display: 'Autorizar', icon: "img/icons/check.svg" },
                        { name: 'Liberar', display: 'Liberar', icon: "img/icons/liberar.svg" },
                        { name: 'Reativar', display: 'Reativar', icon: "img/icons/reply.svg" },
                        { name: 'Suspender', display: 'Suspender', icon: "img/icons/suspender.svg" },
                        { name: 'Continuar', display: 'Continuar', icon: "img/icons/continuar.svg" },
                        { name: 'Cancelar', display: 'Cancelar', icon: "img/icons/cancel.svg" },
                        { name: 'EnviarHistorico', display: 'Enviar para Histórico', icon: "img/icons/enviar_historico.svg" },
                        { name: 'HistoricoInspecao', display: 'Histórico Inspeção', icon: "img/icons/historico_inspecao.svg" },
                        { name: 'HistoricoRevisao', display: 'Histórico Revisão', icon: "img/icons/historico_revisao.svg" },
            ]
        },
        {
            name: 'Amostra', display: 'Amostra', icon: 'img/icons/gestao_amostra.svg',
            subMenu: [
                        { name: 'Editar', display: 'Editar', icon: "img/icons/edit.svg" },
                        { name: 'Teste', display: 'Teste', icon: "img/icons/editar_teste.svg" },
                        { name: 'Resultados', display: 'Resultados', icon: "img/icons/resultado.svg" },
            ]
        },
        { name: 'ExibirDetalhes', display: 'Exibir Detalhes', icon: "img/icons/detail.svg", subMenu: [] }
    ];
    $rootScope.openDialog = function (ev, item) {
      switch (item.name)
      {
          case "Editar" :
              alert('EDITAR');
          break;
          case "ExibirDetalhes" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.rowSelected = $rootScope.rowSelected;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };

                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };

                      $scope.answer = function (answer) {
                          $mdDialog.hide(answer);
                      };
                  },
                  templateUrl: 'gestaoAmostra',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              })
                .then(function (answer) {
                    alert('You said the information was "' + answer + '".');
                }, function () {
                    alert('You cancelled the dialog.');
                });
          break;
          case "ReceberAmostra" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.receber = { numAmostra:null, dthColeta:null, dthRecebimento:null };
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };

                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };

                      $scope.answer = function (_receber) {
                          $mdDialog.hide(_receber);
                      };
                  },
                  templateUrl: 'receberAmostra',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_receber) {
                  $http.put('http://'+ caminhoAPI +'/api/amostras/receberAmostra',{},{ params: { numAmostra: _receber.numAmostra,
                                                                                                 dthColeta: _receber.dthColeta.toISOString(),
                                                                                                 dthRecebimento: _receber.dthRecebimento.toISOString()
                                                                                                }
                                                                                      })
                    .then(function (response) {
                        $window.location.reload();
                          alert(response.data);
                  }, function (response) {
                      alert("Service not Exists \n " +  response.status + " \n " + response.statusText + " \n " + response.headers());
                  });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Inspecionar" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.Inspecao = { NumAmostra:null, PlanoInspecao:null, VersaoInspecao:null, Observacao:null,
                                          Aprovado:false, InspecaoRequerida:null, lstInspecaoCampos:[] };
                      $scope.InspValida = false;

                      $scope.validarInspecao = function (_numAmostra){
                        $http.get('http://'+ caminhoAPI +'/api/amostras/validarInspecao',{ params:{ numAmostra: _numAmostra } })
                           .then(function (response) {
                               $scope.InspValida = true;
                               $scope.Inspecao = response.data;
                              if(response.data.MSG_Erro != null)
                              {
                                 $scope.InspValida = false;
                                 alert(response.data.MSG_Erro);
                              }
                           });
                      };

                      $scope.hide = function () {
                          $mdDialog.hide();
                      };

                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };

                      $scope.answer = function (_inspecao) {
                          $mdDialog.hide(_inspecao);
                      };
                  },
                  templateUrl: 'inspecionar',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_inspecao) {
                  for (var i = _inspecao.lstInspecaoCampos.length - 1; i >= 0; i--) {
                     _inspecao.lstInspecaoCampos[i].Colecao = [];
                  }
                  
                  $http.put('http://' + caminhoAPI + '/api/amostras/inspecionar',{},{ params: { numAmostra: _inspecao.NumAmostra,
                                                                                                aprovado: _inspecao.Aprovado,
                                                                                                observacao: _inspecao.Observacao,
                                                                                                campos: JSON.stringify(_inspecao.lstInspecaoCampos) } })
                    .then(function (response) {
                        $window.location.reload();
                          alert(response.data);
                  }, function (response) {
                      alert("Service not Exists \n " +  response.status + " \n " + response.statusText + " \n " + response.headers());
                  });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Preparacao" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.Preparacao = { numAmostra:null, dataInicial:null, dataFinal:null, observacao:null, campos:null };
                      $scope.IsChanged = false;

                      $scope.formulaCampos = function (_Campo) {
                         $http.get('http://'+ caminhoAPI +'/api/amostras/valorFormula',{ params:{ codigoCampo: _Campo.CodCampo,
                                                                                                 valCampo: _Campo.ValCampo,
                                                                                                 campos: JSON.stringify($scope.Preparacao.campos) } 
                                                                                       })
                          .then(function (response) {
                              if(response.data != null)
                                  $scope.Preparacao.campos = response.data;
                          });      
                      };

                      $scope.arraySearch = function (_numAmostra) {
                          for (var i=0; i<$scope.Amostras.length; i++){
                              if ($scope.Amostras[i].NumAmostra === parseInt(_numAmostra)) {    
                                 if ($scope.Amostras[i].CodPreparacao != null ){
                                    $scope.campoPreparacao($scope.Amostras[i].CodPreparacao);
                                    return $scope.Preparacao.campos;
                                 }     
                              }
                          }
                          $scope.Preparacao.campos = null;
                          return $scope.Preparacao.campos;
                      };

                      $scope.campoPreparacao = function (_codPreparacao) {
                        $http.get('http://'+ caminhoAPI +'/api/amostras/campoPreparacao',{ params:{ codPreparacao: _codPreparacao } })
                           .then(function (response) {
                               $scope.Preparacao.campos = [];
                               for (var i=0; i<response.data.length; i++){
                                    $scope.Preparacao.campos.push({ CodCampo: response.data[i].CodigoCampo,
                                                                    ValCampo: null,
                                                                    NomCampo: response.data[i].NomCampo,
                                                                    TipoCampo: response.data[i].TipoCampo,
                                                                    DesFormula: response.data[i].DesFormula });
                               }
                            }); 
                      };

                      $scope.hide = function () {
                          $mdDialog.hide();
                      };

                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };

                      $scope.answer = function (_preparacao) {
                          $mdDialog.hide(_preparacao);
                      };
                  },
                  templateUrl: 'preparacao',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_preparacao) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/preparacao',{},{ params: { numAmostra: _preparacao.numAmostra,
                                                                                               observacao: _preparacao.observacao,
                                                                                               dthInicio: _preparacao.dataInicial.toISOString(),
                                                                                               dthFim: _preparacao.dataFinal.toISOString(),
                                                                                               campos: JSON.stringify(_preparacao.campos) } } )
                    .then(function (response) {
                        $window.location.reload();
                          alert(response.data);
                  }, function (response) {
                      alert("Service not Exists \n " +  response.status + " \n " + response.statusText + " \n " + response.headers());
                  });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Prioridade" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.Prioridade = { numAmostra:null, numPrioridade:null } ;

                      $scope.arraySearch = function (_numAmostra) {
                          for (var i=0; i<$scope.Amostras.length; i++){
                              if ($scope.Amostras[i].NumAmostra === parseInt(_numAmostra)){    
                                    $scope.Prioridade.numPrioridade = $scope.Amostras[i].NumPrioridade;   
                                    return $scope.Prioridade.numPrioridade;
                             }
                          }
                          $scope.Prioridade.numPrioridade = null;
                          return $scope.Prioridade.numPrioridade;
                      };

                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_prioridade) {
                          $mdDialog.hide(_prioridade);
                      };
                  },
                  templateUrl: 'prioridade',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_prioridade) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/prioridade',{}, { params:{ numAmostra: _prioridade.numAmostra,
                                                                                      prioridade: _prioridade.numPrioridade } })
                    .then(function (response) {
                        $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "MoverAmostra" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.Mover = { numAmostra:null, local:null, data:null, novoLocal:null };

                      $http.get('http://' + caminhoAPI + '/api/amostras/localizacoes')
                          .then(function (response) {
                              $scope.Locais =  response.data;
                          });

                      $scope.arraySearch = function (_numAmostra) {
                          for (var i=0; i<$scope.Amostras.length; i++){
                              if ($scope.Amostras[i].NumAmostra === parseInt(_numAmostra)){    
                                     $scope.Mover.local = $scope.Amostras[i].CodLocalizacao;
                                     return $scope.Mover.local;
                             }
                          }
                          $scope.Mover.local = null;
                          return $scope.Mover.local;
                      };

                      $scope.hide = function () {
                          $mdDialog.hide();
                      };

                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };

                      $scope.answer = function (_Mover) {
                          $mdDialog.hide(_Mover);
                      };
                  },
                  templateUrl: 'moverAmostra',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_Mover) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/moverAmostra',{},{ params:{ numAmostra: _Mover.numAmostra,
                                                                                       novoLocal: _Mover.novoLocal,
                                                                                       data: _Mover.data.toISOString() } })
                    .then(function (response) {
                        $window.location.reload();
                          alert(response.data);
                  }, function (response) {
                      alert("Service not Exists \n " +  response.status + " \n " + response.statusText + " \n " + response.headers());
                  });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Revisao" :
              $mdDialog.show({
                   controller: function ($scope, $mdDialog) {
                       $scope.Amostras = $rootScope.Amostras;
                       $scope.Revisao = { NumAmostra:null, PlanoInspecao:null, VersaoInspecao:null, Observacao:null,
                                           Aprovado:false, InspecaoRequerida:null, lstInspecaoCampos:[] };
                       $scope.ReviValida = false;

                       $scope.validarRevisao = function (_numAmostra){
                         $http.get('http://'+ caminhoAPI +'/api/amostras/validarRevisao',{ params:{ numAmostra: _numAmostra } })
                            .then(function (response) {
                                $scope.ReviValida = true;
                                $scope.Revisao = response.data;
                               if(response.data.MSG_Erro != null)
                               {
                                  $scope.ReviValida = false;
                                  alert(response.data.MSG_Erro);
                               }
                            });
                       };

                       $scope.hide = function () {
                           $mdDialog.hide();
                       };

                       $scope.cancel = function () {
                           $mdDialog.cancel();
                       };

                       $scope.answer = function (_revisao) {
                           $mdDialog.hide(_revisao);
                       };
                   },
                   templateUrl: 'revisar',
                   parent: angular.element(document.body),
                   targetEvent: ev,
                   clickOutsideToClose: true,
               }).then(function (_revisao) {
                   for (var i = _revisao.lstInspecaoCampos.length - 1; i >= 0; i--) {
                      _revisao.lstInspecaoCampos[i].Colecao = [];
                   }
                   
                   $http.put('http://' + caminhoAPI + '/api/amostras/revisarAmostra',{},{ params: { numAmostra: _revisao.NumAmostra,
                                                                                                 aprovado: _revisao.Aprovado,
                                                                                                 observacao: _revisao.Observacao,
                                                                                                 campos: JSON.stringify(_revisao.lstInspecaoCampos) } })
                     .then(function (response) {
                         $window.location.reload();
                           alert(response.data);
                   }, function (response) {
                       alert("Service not Exists \n " +  response.status + " \n " + response.statusText + " \n " + response.headers());
                   });
               }, function () {
                   alert('You cancelled the dialog.');
               });
          break;
          case "CompletarAmostra" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'completarAmostra',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/completarAmostra',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                        $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Autorizar" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'autorizar',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/autorizar',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                           $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Liberar" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'liberar',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/liberar',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                           $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Reativar" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'reativar',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/reativar',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                           $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Suspender" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'suspender',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/suspender',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                        $window.location.reload();
                        alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Continuar" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'continuar',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/continuar',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                        $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "Cancelar" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'cancelar',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/cancelar',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                           $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "EnviarHistorico" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $mdDialog.hide(_numAmostra);
                      };
                  },
                  templateUrl: 'enviarHistorico',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  $http.put('http://' + caminhoAPI + '/api/amostras/enviarHistorico',{},{ params:{ numAmostra: _numAmostra } })
                    .then(function (response) {
                           $window.location.reload();
                            alert(response.data);
                    }, function (response) {
                        alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                    });
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "HistoricoInspecao" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog) {
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.Plano = null;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $http.get('http://' + caminhoAPI + '/api/amostras/historicoInspecao',{ params:{ numAmostra: _numAmostra } })
                            .then(function (response) {
                                  if(response.data.length > 0){
                                    $scope.tableParams = new NgTableParams({ page: 1, count: 30 }, {
                                          paginationMaxBlocks: 5,
                                          paginationMinBlocks: 2,
                                          counts: [],
                                          dataset: response.data
                                      });
                                    $scope.Plano = response.data[0].CodPlanoInspecao;
                                  }
                                  else{
                                      $scope.tableParams = new NgTableParams({ page: 1, count: 30 }, {
                                          paginationMaxBlocks: 5,
                                          paginationMinBlocks: 2,
                                          counts: [],
                                          dataset: null
                                      });
                                    $scope.Plano = null;
                                    alert("Não Existe Histórico de Inspeção");
                                  }
                            }, function (response) {
                                alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                            });
                      };
                  },
                  templateUrl: 'historicoInspecao',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          case "HistoricoRevisao" :
              $mdDialog.show({
                  controller: function ($scope, $mdDialog){
                      $scope.Amostras = $rootScope.Amostras;
                      $scope.Plano = null;
                      $scope.numAmostra = null;
                      $scope.hide = function () {
                          $mdDialog.hide();
                      };
                      $scope.cancel = function () {
                          $mdDialog.cancel();
                      };
                      $scope.answer = function (_numAmostra) {
                          $http.get('http://' + caminhoAPI + '/api/amostras/historicoRevisao',{ params:{ numAmostra: _numAmostra } })
                            .then(function (response) {
                                  if(response.data.length > 0){
                                    $scope.tableParams = new NgTableParams({ page: 1, count: 30 }, {
                                          paginationMaxBlocks: 5,
                                          paginationMinBlocks: 2,
                                          counts: [],
                                          dataset: response.data
                                      });
                                    $scope.Plano = response.data[0].CodPlanoInspecao;
                                  }
                                  else{
                                      $scope.tableParams = new NgTableParams({ page: 1, count: 30 }, {
                                          paginationMaxBlocks: 5,
                                          paginationMinBlocks: 2,
                                          counts: [],
                                          dataset: null
                                      });
                                    $scope.Plano = null;
                                    alert("Não Existe Histórico de Revisão");
                                  }
                            }, function (response) {
                                alert("Service not Exists \n " + response.status + " \n " + response.statusText + " \n " + response.headers());
                            });
                      };
                  },
                  templateUrl: 'historicoRevisao',
                  parent: angular.element(document.body),
                  targetEvent: ev,
                  clickOutsideToClose: true,
              }).then(function (_numAmostra) {
                  
              }, function () {
                  alert('You cancelled the dialog.');
              });
          break;
          default: alert('DELETAR');
          break;
      }
    };
});
app.controller('TableCtrl', ['$scope', '$rootScope', '$mdDialog', '$http', 'NgTableParams',
    function ($scope, $rootScope, $mdDialog, $http, NgTableParams) {
        $mdDialog.show({
            template:
            '<md-dialog style="background-color:transparent;box-shadow:none" aria-label="Loaging">' +
                '<md-dialog-content>' +
                    '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait" style="height:70px;">' +
                        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                    '</div>' +
                '</md-dialog-content>' +
            '</md-dialog>',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
        $http.get('http://' + caminhoAPI + '/api/amostras')
        .then(function (response) {
            $scope.tableParams = new NgTableParams({ page: 1, count: 30 }, {
                paginationMaxBlocks: 5,
                paginationMinBlocks: 2,
                counts: [],
                dataset: response.data
            });
            $rootScope.Amostras = response.data;
            $scope.setSelected(response.data[0]);
            $mdDialog.hide();
        });
        $scope.setSelected = function (rowSelected) {
            $rootScope.rowSelected = rowSelected;
        };
    }
]);
