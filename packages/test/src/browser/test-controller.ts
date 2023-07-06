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
import { TestController, TestItem, TestRun, TestRunProfile } from './test-service';
import { TreeDelta, CollectionDelta } from './tree-delta';
import { SimpleObservableCollection } from './collections';

export class TestControllerImpl implements TestController {
    private _profiles = new SimpleObservableCollection<TestRunProfile>();
    private _runs = new SimpleObservableCollection<TestRun>();

    constructor(readonly id: string, readonly label: string) {
    }

    tests: TestItem[];

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

    onItemsChanged: Event<TreeDelta<string, TestItem>[]>;
}
