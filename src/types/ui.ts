// UI component and form related types
export interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FormSelectProps extends Omit<FormFieldProps, 'type'> {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  defaultValue?: string | string[];
}

export interface FormCheckboxProps extends Omit<FormFieldProps, 'type'> {
  checked?: boolean;
  defaultChecked?: boolean;
}

export interface FormTextareaProps extends Omit<FormFieldProps, 'type'> {
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export interface FormFileUploadProps extends Omit<FormFieldProps, 'type'> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  preview?: boolean;
  dragAndDrop?: boolean;
}

export interface FormDatePickerProps extends Omit<FormFieldProps, 'type'> {
  format?: string;
  minDate?: Date;
  maxDate?: Date;
  showTime?: boolean;
}

export interface FormTimePickerProps extends Omit<FormFieldProps, 'type'> {
  format?: '12' | '24';
  step?: number;
  minTime?: string;
  maxTime?: string;
}

export interface FormNumberInputProps extends Omit<FormFieldProps, 'type'> {
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  format?: 'currency' | 'percentage' | 'decimal';
  currency?: string;
}

export interface ValidationRule {
  required?: boolean | string;
  minLength?: number | { value: number; message: string };
  maxLength?: number | { value: number; message: string };
  min?: number | { value: number; message: string };
  max?: number | { value: number; message: string };
  pattern?: RegExp | { value: RegExp; message: string };
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
  custom?: (value: any, formData: any) => boolean | string;
}

export interface FormFieldConfig {
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'time' | 'datetime';
  label: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
  validation?: ValidationRule;
  options?: SelectOption[];
  props?: Record<string, any>;
  conditional?: {
    dependsOn: string;
    showWhen: (value: any) => boolean;
  };
  grid?: {
    cols?: number;
    colSpan?: number;
    rowSpan?: number;
  };
}

export interface FormStepConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  validation?: (data: any) => boolean | string[] | Promise<boolean | string[]>;
  onComplete?: (data: any) => void | Promise<void>;
}

export interface MultiStepFormConfig {
  steps: FormStepConfig[];
  onSubmit: (data: any) => void | Promise<void>;
  onStepChange?: (step: number, data: any) => void;
  persistData?: boolean;
  storageKey?: string;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  filter?: {
    type: 'text' | 'select' | 'date' | 'number';
    options?: SelectOption[];
  };
  width?: number | string;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => string;
  };
  selection?: {
    type: 'checkbox' | 'radio';
    selectedRowKeys?: string[];
    onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  sorting?: {
    field?: string;
    order?: 'asc' | 'desc';
    onChange?: (field: string, order: 'asc' | 'desc') => void;
  };
  filtering?: Record<string, any>;
  onFilter?: (filters: Record<string, any>) => void;
  expandable?: {
    expandedRowKeys?: string[];
    onExpand?: (expanded: boolean, record: T) => void;
    expandedRowRender?: (record: T) => React.ReactNode;
  };
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  sticky?: boolean;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  size?: number | string;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  destroyOnClose?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface ToastType {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}

export interface NotificationContextType {
  toasts: ToastType[];
  toast: (toast: Omit<ToastType, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning';
  loading?: boolean;
}

export interface StepperStep {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  optional?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'simple' | 'compact';
  className?: string;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  loading?: boolean;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  className?: string;
}

export interface FilterState {
  [key: string]: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'multiSelect' | 'date' | 'dateRange' | 'number' | 'numberRange' | 'boolean';
  options?: SelectOption[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FiltersProps {
  config: FilterConfig[];
  values: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  loading?: boolean;
  className?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  className?: string;
}
