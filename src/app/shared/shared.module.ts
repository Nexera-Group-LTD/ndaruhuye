import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Alert } from './components/alert/alert';
import { Badge } from './components/badge/badge';
import { Button } from './components/button/button';
import { Input } from './components/input/input';
import { Loader } from './components/loader/loader';
import { AlertContainer } from './components/alert/alert-container';
import { Divider } from './components/divider/divider';
import { Modal } from './components/modal/modal';
import { Tab } from './components/tab/tab';
import { Tooltip } from './components/tooltip/tooltip';
import { Select } from './components/select/select';
import { Skeleton } from './components/skeleton/skeleton';
import { Textarea } from './components/textarea/textarea';
import { TabPanelDirective } from './components/tab/directives/tab-panel.directive';

const COMPONENTS = [
  Badge,
  Button,
  Loader,
  Alert,
  AlertContainer,
  Input,
  Divider,
  Modal,
  Tab,
  Tooltip,
  Select,
  Skeleton,
  Textarea,
  TabPanelDirective,
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, ...COMPONENTS],
})
export class SharedModule {}
