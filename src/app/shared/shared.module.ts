import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [],
    imports: [CommonModule, FlexLayoutModule, MaterialModule, FormsModule, ReactiveFormsModule],
    exports: [CommonModule, FlexLayoutModule, MaterialModule, FormsModule, ReactiveFormsModule]
})

export class SharedModule { }
