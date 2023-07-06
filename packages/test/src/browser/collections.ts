// *****************************************************************************
// Copyright (C) 2022 STMicroelectronics and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************

import { Event } from '@theia/core';
import { CollectionDelta } from './tree-delta';
import { Emitter } from '@theia/core/shared/vscode-languageserver-protocol';

export class SimpleObservableCollection<V> {
    private _values: V[] = [];

    constructor(private equals: (left: V, right: V) => boolean = (left, right) => left === right) {
    }

    add(value: V): boolean {
        if (!this._values.find(v => this.equals(v, value))) {
            this._values.push(value);
            this.onChangeEmitter.fire({ added: [value] });
            return true;
        }
        return false;
    }

    remove(value: V): boolean {
        const index = this._values.findIndex(v => this.equals(v, value));
        if (index >= 0) {
            this._values.splice(index, 1);
            this.onChangeEmitter.fire({ removed: [value] });
            return true;
        }
        return false;
    }

    private onChangeEmitter = new Emitter<CollectionDelta<V, V>>();
    onChanged: Event<CollectionDelta<V, V>> = this.onChangeEmitter.event;
    get values(): readonly V[] {
        return this._values;
    }
}
