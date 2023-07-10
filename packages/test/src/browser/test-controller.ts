/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { Event, URI } from '@theia/core';
import { Range } from '@theia/core/shared/vscode-languageserver-protocol';

import { TestController, TestItem, TestRun, TestRunProfile } from './test-service';
import { TreeDelta, CollectionDelta, TreeDeltaBuilder } from './tree-delta';
import { SimpleObservableCollection, TreeCollection } from './collections';
import { MarkdownString } from '@theia/core/lib/common/markdown-rendering';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function observableProperty(observationFunction: string): (target: any, property: string) => any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, property: string): any => {
        Reflect.defineProperty(target, property, {
            // @ts-ignore
            get(): any { return this['_' + property]; },
            set(v: any): void {
                // @ts-ignore
                this[observationFunction](property, v);
                // @ts-ignore
                this['_' + property] = v;
            }
        });
    };
}

export class TestItemImpl implements TestItem {
    constructor(private readonly deltaBuilder: TreeDeltaBuilder<string, TestItemImpl>, private readonly path: string[], readonly uri: URI) {
        this._children = new TreeCollection<string, TestItemImpl>(item => item.path, deltaBuilder);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected notifyPropertyChange(property: keyof TestItemImpl, value: any): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val: any = {};
        val[property] = value;
        this.deltaBuilder.reportChanged(this.path, val);
    }

    get id(): string {
        return this.path[this.path.length - 1];
    }

    @observableProperty('notifyPropertyChange')
    label: string;

    @observableProperty('notifyPropertyChange')
    range: Range;

    @observableProperty('notifyPropertyChange')
    sortKey?: string | undefined;

    @observableProperty('notifyPropertyChange')
    tags: string[];

    @observableProperty('notifyPropertyChange')
    busy: boolean;

    @observableProperty('notifyPropertyChange')
    canResolveChildren: boolean;

    @observableProperty('notifyPropertyChange')
    description?: string | undefined;

    @observableProperty('notifyPropertyChange')
    error?: string | MarkdownString | undefined;

    _children: TreeCollection<string, TestItemImpl>;
    get children(): readonly TestItem[] {
        return this._children.values;
    }

}

export class TestControllerImpl implements TestController {
    private _profiles = new SimpleObservableCollection<TestRunProfile>();
    private _runs = new SimpleObservableCollection<TestRun>();

    constructor(readonly id: string, readonly label: string) {
    }

    get testRunProfiles(): readonly TestRunProfile[] {
        return this._profiles.values;
    }

    addProfile(profile: TestRunProfile): void {
        this._profiles.add(profile);
    }

    onProfilesChanged: Event<CollectionDelta<TestRunProfile, TestRunProfile>> = this._profiles.onChanged;

    get testRuns(): readonly TestRun[] {
        return this._runs.values;
    }
    onRunsChanged: Event<CollectionDelta<TestRun, TestRun>> = this._runs.onChanged;

    tests: TestItem[];
    onItemsChanged: Event<TreeDelta<string, TestItem>[]>;
}
