var app = angular.module('AppController', []);
app.controller('AppCtrl', function ($scope, $mdSidenav, $log, $rootScope, $mdDialog) {
    $rootScope.title = 'PSV LIMS';
    $rootScope.btnOption = false;
    $rootScope.lstItensOperacoes = [];
    $rootScope.openDialog = null;
    $scope.showChilds = function (item) {
        item.active = !item.active;
        item.activeIcon = item.active ? 'img/icons/expand_less.svg' : 'img/icons/expand_more.svg';
    };
    $scope.toggleSidenav = function (navID) {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
              $log.debug("toggle " + navID + " is done");
          });
    };
    $scope.closeSidenav = function (navID) {
        $mdSidenav(navID).close()
          .then(function () {
              $log.debug("close " + navID + " is done");
          });

    };
    $scope.lstItensMenu = [
       { name: 'GestaoAmostra', display: 'Gestão da Amostra', icon: 'img/icons/gestao_amostra.svg', href: '#!/GestaoAmostra' },
       { name: 'Teste1', display: 'Teste 1', icon: 'img/icons/teste.svg', href: '#!/Teste1' },
       { name: 'Teste2', display: 'Teste 2', icon: 'img/icons/teste.svg', href: '#!/Teste2' },
    ];
});
