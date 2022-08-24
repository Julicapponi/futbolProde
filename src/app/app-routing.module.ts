import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NAVIGATE_REGISTRO, RegistroPage} from './registro/registro.page';
import {LogueoPage, NAVIGATE_LOGIN} from './logueo/logueo.page';
import {InicioPagePage} from './inicio-page/inicio-page.page';
import {AuthGuard } from './auth.guard';
import {ResetPassPage} from './reset-pass/reset-pass.page';
import {InicioAdministradorPage} from './inicio-administrador/inicio-administrador.page';
import {ListUsersPage, NAVIGATE_LIST_USER} from './list-users/list-users.page';
import {PartidosPage} from './partidos/partidos.page';
import {EditUserPage, NAVIGATE_EDITAR_USER} from './edit-user/edit-user.page';
import {AltaCompetenciaPage} from './alta-competencia/alta-competencia.page';
import {ListEnfrentamientosPage} from "./list-enfrentamientos/list-enfrentamientos.page";
import {DetallePartidoPage} from "./detalle-partido/detalle-partido.page";


const routes: Routes = [
  {path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: NAVIGATE_REGISTRO, component: RegistroPage, pathMatch: 'full'},
  {path: 'registroPage', component: RegistroPage},
  { path: NAVIGATE_LOGIN, component: LogueoPage, pathMatch: 'full'},
  {path: 'logueoPage', component: LogueoPage},
  {path: 'inicioPage', component: InicioPagePage, canActivate: [AuthGuard]},
  {path: 'resetPassPage', component: ResetPassPage},
  {path: 'inicio-administrador', component: InicioAdministradorPage},
  {path: 'list-users', component: ListUsersPage},
  { path: NAVIGATE_LIST_USER, component: ListUsersPage, pathMatch: 'full'},
  {path: 'partidosPage', component: PartidosPage},
  { path: NAVIGATE_EDITAR_USER, component: EditUserPage, pathMatch: 'full'},
  {path: 'editUserPage/:id', component: EditUserPage},
  {path: 'partidos', component: PartidosPage},
  {path: 'altaCompetencia', component: AltaCompetenciaPage},
  //{path: 'listEnfrentamientos/:id/:anio', component: ListEnfrentamientosPage},
  {path: 'listEnfrentamientos', component: ListEnfrentamientosPage},
  {path: 'detallePartido', component: DetallePartidoPage},
  {
    path: 'prueba',
    loadChildren: () => import('./prueba/prueba.module').then( m => m.PruebaPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'logueo',
    loadChildren: () => import('./logueo/logueo.module').then( m => m.LogueoPageModule)
  },
  {
    path: 'inicio-page',
    loadChildren: () => import('./inicio-page/inicio-page.module').then( m => m.InicioPagePageModule)
  },
  {
    path: 'reset-pass',
    loadChildren: () => import('./reset-pass/reset-pass.module').then( m => m.ResetPassPageModule)
  },
  {
    path: 'inicio-administrador',
    loadChildren: () => import('./inicio-administrador/inicio-administrador.module').then( m => m.InicioAdministradorPageModule)
  },
  {
    path: 'list-users',
    loadChildren: () => import('./list-users/list-users.module').then( m => m.ListUsersPageModule)
  },
  {
    path: 'partidosPage',
    loadChildren: () => import('./partidos/partidos.module').then( m => m.PartidosPageModule)
  },
  {
    path: 'editUserPage',
    loadChildren: () => import('./edit-user/edit-user.module').then( m => m.EditUserPageModule)
  },
  {
    path: 'alta-competencia',
    loadChildren: () => import('./alta-competencia/alta-competencia.module').then( m => m.AltaCompetenciaPageModule)
  },
  {
    path: 'list-enfrentamientos',
    loadChildren: () => import('./list-enfrentamientos/list-enfrentamientos.module').then( m => m.ListEnfrentamientosPageModule)
  },
  {
    path: 'detalle-partido',
    loadChildren: () => import('./detalle-partido/detalle-partido.module').then( m => m.DetallePartidoPageModule)
  },

];

@NgModule({
  imports: [CommonModule,
    FormsModule,
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  declarations: [
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
